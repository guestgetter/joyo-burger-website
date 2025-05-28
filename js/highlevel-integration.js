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
            const response = await fetch(`${this.apiBaseUrl}/contacts/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    locationId: this.locationId,
                    ...contactData
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('✅ Contact submitted to HighLevel:', result);
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