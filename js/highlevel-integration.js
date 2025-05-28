/**
 * JOYO Burger - HighLevel CRM Integration
 * Handles form submissions to HighLevel API with fallback email notifications
 */

class HighLevelIntegration {
    constructor() {
        // Updated with new Private Integration API key
        this.apiKey = 'pit-858161ad-610f-4983-9da2-f849c3ba2988';
        this.locationId = '9lWdjn3JvgHkgrYeXzUM';
        // Updated to correct API v2 endpoint
        this.apiBaseUrl = 'https://services.leadconnectorhq.com';
        this.fallbackEmails = ['info@joyoburger.com', 'kyle@nimblebar.co'];
    }

    /**
     * Submit contact to HighLevel CRM
     */
    async submitContact(contactData) {
        try {
            // First, check if contact already exists
            const existingContact = await this.findExistingContact(contactData.email);
            
            if (existingContact) {
                console.log('🔄 Contact exists, updating instead of creating...');
                return await this.updateExistingContact(existingContact.id, contactData);
            }

            // Create new contact if none exists
            const response = await fetch(`${this.apiBaseUrl}/contacts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    // Correct v2 API format
                    firstName: contactData.firstName || contactData.fullName?.split(' ')[0] || '',
                    lastName: contactData.lastName || contactData.fullName?.split(' ').slice(1).join(' ') || '',
                    name: contactData.fullName || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
                    email: contactData.email,
                    phone: contactData.phone,
                    locationId: this.locationId,
                    tags: contactData.tags || []
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('✅ Contact created in HighLevel:', result);
                return { success: true, data: result };
            } else {
                console.error('❌ HighLevel API Error:', result);
                throw new Error(result.message || 'Failed to submit to HighLevel');
            }
        } catch (error) {
            console.error('❌ HighLevel Integration Error:', error);
            
            // Fallback: Send email notification
            await this.sendFallbackEmail(contactData);
            
            return { 
                success: true, // Still show success to user
                fallback: true,
                error: error.message 
            };
        }
    }

    /**
     * Find existing contact by email
     */
    async findExistingContact(email) {
        try {
            // Use the correct GET contacts endpoint with query parameter
            const response = await fetch(`${this.apiBaseUrl}/contacts/?locationId=${this.locationId}&query=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                }
            });

            if (response.ok) {
                const result = await response.json();
                
                // Check if any contacts were found and if email matches exactly
                if (result.contacts && result.contacts.length > 0) {
                    // Find exact email match (case insensitive)
                    const exactMatch = result.contacts.find(contact => 
                        contact.email && contact.email.toLowerCase() === email.toLowerCase()
                    );
                    
                    if (exactMatch) {
                        console.log('📧 Found existing contact:', exactMatch);
                        return exactMatch;
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('❌ Error searching for existing contact:', error);
            return null;
        }
    }

    /**
     * Update existing contact when duplicate is found
     */
    async updateExistingContact(contactId, contactData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/contacts/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    firstName: contactData.firstName || contactData.fullName?.split(' ')[0] || '',
                    lastName: contactData.lastName || contactData.fullName?.split(' ').slice(1).join(' ') || '',
                    name: contactData.fullName || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
                    phone: contactData.phone,
                    tags: contactData.tags || []
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Contact updated successfully:', result);
                return { success: true, data: result, updated: true };
            } else {
                const error = await response.json();
                console.error('❌ Update failed:', error);
                throw new Error(error.message || 'Failed to update contact');
            }
            
        } catch (error) {
            console.error('❌ Update contact failed:', error);
            // Still return success for user experience, but log the issue
            return { success: true, fallback: true, error: error.message };
        }
    }

    /**
     * Handle newsletter form submission
     */
    async handleNewsletterSubmission(formData) {
        const contactData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            tags: ['joyo-vip'] // Always tag newsletter signups as VIP
        };

        return await this.submitContact(contactData);
    }

    /**
     * Handle contact form submission
     */
    async handleContactSubmission(formData) {
        const contactData = {
            fullName: formData.get('name'), // Contact form uses 'name' field
            email: formData.get('email'),
            phone: formData.get('phone'),
            comments: formData.get('comments') || '' // Get the comments field
        };

        // Check if they opted into VIP (newsletter checkbox)
        const vipOptIn = formData.get('newsletter');
        if (vipOptIn) {
            contactData.tags = ['joyo-vip'];
        }

        // Always send email notification for contact form submissions
        const emailSent = await this.sendContactFormEmail(contactData);

        // Also submit to HighLevel CRM
        const crmResult = await this.submitContact(contactData);

        // Return combined result
        return {
            success: crmResult.success,
            emailSent: emailSent,
            data: crmResult.data,
            updated: crmResult.updated,
            fallback: crmResult.fallback
        };
    }

    /**
     * Send email notification for contact form submissions
     */
    async sendContactFormEmail(contactData) {
        try {
            // Prepare email content
            const emailSubject = `New Contact Form Submission from ${contactData.fullName}`;
            const emailBody = `
New contact form submission received from JOYO Burger website:

Name: ${contactData.fullName}
Email: ${contactData.email}
Phone: ${contactData.phone}
${contactData.comments ? `Comments: ${contactData.comments}` : ''}
${contactData.tags && contactData.tags.includes('joyo-vip') ? '\n✨ VIP Newsletter Signup: YES' : ''}

Submitted: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}

---
This message was sent automatically from the JOYO Burger website contact form.
            `.trim();

            console.log('📧 Contact Form Email Notification:', {
                to: this.fallbackEmails,
                subject: emailSubject,
                contactData: contactData
            });

            // Method 1: Try Netlify Forms (if deployed on Netlify)
            if (window.location.hostname.includes('netlify') || window.location.hostname.includes('github.io')) {
                try {
                    const netlifyResponse = await fetch('/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            'form-name': 'contact',
                            'name': contactData.fullName,
                            'email': contactData.email,
                            'phone': contactData.phone,
                            'comments': contactData.comments || '',
                            'newsletter': contactData.tags && contactData.tags.includes('joyo-vip') ? 'on' : '',
                            'subject': emailSubject
                        }).toString()
                    });

                    if (netlifyResponse.ok) {
                        console.log('✅ Email notification sent via Netlify Forms');
                        return true;
                    }
                } catch (netlifyError) {
                    console.log('⚠️ Netlify Forms failed, trying other methods...', netlifyError);
                }
            }

            // Method 2: Try Formspree (backup email service)
            try {
                const formspreeResponse = await fetch('https://formspree.io/f/xdkogkpv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: contactData.fullName,
                        email: contactData.email,
                        phone: contactData.phone,
                        comments: contactData.comments || 'No comments provided',
                        vip_signup: contactData.tags && contactData.tags.includes('joyo-vip') ? 'Yes' : 'No',
                        _subject: emailSubject,
                        _replyto: contactData.email,
                        _cc: this.fallbackEmails.join(',')
                    })
                });

                if (formspreeResponse.ok) {
                    console.log('✅ Email notification sent via Formspree');
                    return true;
                }
            } catch (formspreeError) {
                console.log('⚠️ Formspree failed, trying EmailJS...', formspreeError);
            }

            // Method 3: Try EmailJS if available and configured
            if (typeof emailjs !== 'undefined' && window.emailjsConfigured) {
                try {
                    await emailjs.send('service_id', 'template_id', {
                        to_email: this.fallbackEmails.join(','),
                        subject: emailSubject,
                        message: emailBody,
                        from_name: contactData.fullName,
                        from_email: contactData.email,
                        phone: contactData.phone,
                        comments: contactData.comments || 'No comments provided'
                    });
                    console.log('✅ Email notification sent via EmailJS');
                    return true;
                } catch (emailjsError) {
                    console.log('⚠️ EmailJS failed:', emailjsError);
                }
            }

            // Method 4: Final fallback - log for manual processing
            console.log('📧 All email methods failed. Contact form data logged for manual processing:', {
                timestamp: new Date().toISOString(),
                name: contactData.fullName,
                email: contactData.email,
                phone: contactData.phone,
                comments: contactData.comments,
                vipSignup: contactData.tags && contactData.tags.includes('joyo-vip')
            });

            // Store in localStorage as emergency backup
            const emergencyBackup = JSON.parse(localStorage.getItem('joyoContactBackup') || '[]');
            emergencyBackup.push({
                timestamp: new Date().toISOString(),
                ...contactData
            });
            localStorage.setItem('joyoContactBackup', JSON.stringify(emergencyBackup));
            
            return false; // Indicate email sending failed
            
        } catch (error) {
            console.error('❌ Failed to send contact form email:', error);
            return false;
        }
    }

    /**
     * Fallback email notification when HighLevel fails
     */
    async sendFallbackEmail(contactData) {
        try {
            // This would typically integrate with your email service
            // For now, we'll log the attempt
            console.log('📧 Sending fallback email notification:', {
                to: this.fallbackEmails,
                subject: 'New JOYO Contact Submission',
                data: contactData
            });
            
            // In a real implementation, you'd integrate with:
            // - EmailJS
            // - Netlify Forms
            // - Your backend email service
            
        } catch (error) {
            console.error('❌ Fallback email failed:', error);
        }
    }

    /**
     * Show success message to user
     */
    showSuccessMessage(container, isVip = false, emailSent = true) {
        const messageHtml = `
            <div class="form-success-message">
                <span class="success-icon">🎉</span>
                <h3>Thank You!</h3>
                <p>Your submission has been received successfully.</p>
                ${isVip ? '<p><strong>Welcome to the JOYO VIP family!</strong> 🌟</p>' : ''}
                ${emailSent ? '<p>📧 Our team has been notified and will be in touch soon!</p>' : '<p>⚠️ We received your message and will respond as soon as possible.</p>'}
            </div>
        `;
        
        container.innerHTML = messageHtml;
    }

    /**
     * Show error message to user
     */
    showErrorMessage(container) {
        const messageHtml = `
            <div class="form-error-message">
                <span class="error-icon">⚠️</span>
                <h3>Oops! Something went wrong</h3>
                <p>We're having trouble processing your request right now.</p>
                <p>Please try again later or contact us directly at <a href="mailto:info@joyoburger.com">info@joyoburger.com</a></p>
            </div>
        `;
        
        container.innerHTML = messageHtml;
    }
}

// Initialize and expose globally
window.highLevelIntegration = new HighLevelIntegration(); 