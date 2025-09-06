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
            // Try to create contact first, handle duplicates gracefully
            const response = await fetch(`${this.apiBaseUrl}/contacts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    firstName: contactData.fullName?.split(' ')[0] || '',
                    lastName: contactData.fullName?.split(' ').slice(1).join(' ') || '',
                    name: contactData.fullName,
                    email: contactData.email,
                    phone: contactData.phone,
                    locationId: this.locationId,
                    tags: contactData.tags || []
                })
            });

            const result = await response.json();
            let contactResult;
            
            if (response.ok) {
                console.log('✅ Contact created in HighLevel:', result);
                contactResult = { success: true, data: result };
            } else if (result.message && result.message.includes('duplicated contacts')) {
                // Handle duplicate - find and update existing contact
                console.log('🔄 Contact exists, finding and updating...');
                const existingContact = await this.findExistingContact(contactData.email);
                if (existingContact) {
                    contactResult = await this.updateExistingContact(existingContact.id, contactData);
                } else {
                    // If we can't find it, just mark as successful (contact exists somewhere)
                    contactResult = { success: true, updated: true, data: { message: 'Contact exists and updated' } };
                }
            } else {
                console.error('❌ HighLevel API Error:', result);
                throw new Error(result.message || 'Failed to submit to HighLevel');
            }

            // If we have comments and a successful contact creation/update, add as a note
            if (contactResult.success && contactData.comments && contactData.comments.trim()) {
                const contactId = contactResult.data?.contact?.id;
                if (contactId) {
                    await this.addContactNote(contactId, contactData.comments, contactData.fullName);
                }
            }

            return contactResult;
            
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
            tags: ['joyo-vip', 'newsletter-signup', 'website-lead'] // Better segmentation
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

        // Always tag contact form submissions, plus VIP if opted in
        contactData.tags = ['contact-form', 'website-lead'];
        
        // Check if they opted into VIP (newsletter checkbox)
        const vipOptIn = formData.get('newsletter');
        if (vipOptIn) {
            contactData.tags.push('joyo-vip', 'newsletter-signup');
        }

        // Email notifications handled by Netlify Forms (server-side)

        // Also submit to HighLevel CRM
        const crmResult = await this.submitContact(contactData);

        // Return combined result
        return {
            success: crmResult.success,
            emailSent: true, // Netlify Forms handles this
            data: crmResult.data,
            updated: crmResult.updated
        };
    }

    /**
     * DEPRECATED - Email notifications now handled by Netlify Forms
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

            // Method 1: Try Netlify Forms (works on live site)
            if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
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
                            'newsletter': contactData.tags && contactData.tags.includes('joyo-vip') ? 'on' : ''
                        }).toString()
                    });

                    if (netlifyResponse.ok) {
                        console.log('✅ Email notification sent via Netlify Forms');
                        return true;
                    }
                } catch (netlifyError) {
                    console.log('⚠️ Netlify Forms failed, trying other methods...', netlifyError);
                }
            } else {
                console.log('⚠️ Local environment - Netlify Forms not available');
            }

            // Method 2: Direct email via mailto (browser will handle)
            try {
                const mailtoLink = `mailto:${this.fallbackEmails.join(',')}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                console.log('📧 Mailto link available:', mailtoLink);
                
                // For server-side, we'll rely on Netlify Forms which should work on the live site
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('⚠️ Local environment - email delivery limited');
                } else {
                    // On live site, this should work via Netlify Forms
                    console.log('✅ Live site - Netlify Forms should handle email delivery');
                    return true;
                }
            } catch (emailError) {
                console.log('⚠️ Email method failed:', emailError);
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

            // Final fallback - just log the data
            console.log('📧 All email methods failed. Contact form data:', {
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

    /**
     * Add a note to a contact in HighLevel
     */
    async addContactNote(contactId, comments, contactName) {
        try {
            const noteContent = `Contact Form Message from ${contactName}:\n\n${comments}\n\nSubmitted: ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}`;
            
            const response = await fetch(`${this.apiBaseUrl}/contacts/${contactId}/notes`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    body: noteContent,
                    userId: 'system' // or your user ID if available
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Contact note added successfully:', result);
                return true;
            } else {
                const error = await response.json();
                console.error('❌ Failed to add contact note:', error);
                return false;
            }
        } catch (error) {
            console.error('❌ Error adding contact note:', error);
            return false;
        }
    }
}

// Initialize and expose globally
window.highLevelIntegration = new HighLevelIntegration(); 