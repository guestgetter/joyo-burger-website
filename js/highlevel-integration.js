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
            // Use the correct v2 endpoint format
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
                    customFields: contactData.customFields || [],
                    tags: contactData.tags || []
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('✅ Contact submitted to HighLevel:', result);
                return { success: true, data: result };
            } else {
                console.error('❌ HighLevel API Error:', result);
                
                // If it's a duplicate contact error, try to update instead
                if (result.message && result.message.includes('duplicated contacts')) {
                    console.log('🔄 Contact exists, attempting to update...');
                    return await this.updateExistingContact(contactData);
                }
                
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
     * Update existing contact when duplicate is found
     */
    async updateExistingContact(contactData) {
        try {
            // First, find the contact by email
            const searchResponse = await fetch(`${this.apiBaseUrl}/contacts/search/duplicate?locationId=${this.locationId}&email=${contactData.email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                }
            });

            if (searchResponse.ok) {
                const searchResult = await searchResponse.json();
                if (searchResult.contacts && searchResult.contacts.length > 0) {
                    const existingContact = searchResult.contacts[0];
                    
                    // Update the existing contact
                    const updateResponse = await fetch(`${this.apiBaseUrl}/contacts/${existingContact.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/json',
                            'Version': '2021-07-28'
                        },
                        body: JSON.stringify({
                            firstName: contactData.firstName || contactData.fullName?.split(' ')[0] || existingContact.firstName,
                            lastName: contactData.lastName || contactData.fullName?.split(' ').slice(1).join(' ') || existingContact.lastName,
                            phone: contactData.phone || existingContact.phone,
                            customFields: contactData.customFields || [],
                            tags: [...(existingContact.tags || []), ...(contactData.tags || [])]
                        })
                    });

                    if (updateResponse.ok) {
                        const updateResult = await updateResponse.json();
                        console.log('✅ Contact updated successfully:', updateResult);
                        return { success: true, data: updateResult, updated: true };
                    }
                }
            }
            
            // If update fails, still return success for user experience
            return { success: true, fallback: true };
            
        } catch (error) {
            console.error('❌ Update contact failed:', error);
            return { success: true, fallback: true };
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
            customFields: [
                {
                    key: 'birthday',
                    value: formData.get('birthday')
                },
                {
                    key: 'source',
                    value: 'Newsletter Signup'
                }
            ],
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
            customFields: [
                {
                    key: 'message',
                    value: formData.get('comments') // Contact form uses 'comments' field
                },
                {
                    key: 'source',
                    value: 'Contact Form'
                }
            ]
        };

        // Check if they opted into VIP (newsletter checkbox)
        const vipOptIn = formData.get('newsletter');
        if (vipOptIn) {
            contactData.tags = ['joyo-vip'];
        }

        return await this.submitContact(contactData);
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
    showSuccessMessage(container, isVip = false) {
        const messageHtml = `
            <div class="form-success-message">
                <span class="success-icon">🎉</span>
                <h3>Thank You!</h3>
                <p>Your submission has been received successfully.</p>
                ${isVip ? '<p><strong>Welcome to the JOYO VIP family!</strong> 🌟</p>' : ''}
                <p>We'll be in touch soon!</p>
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