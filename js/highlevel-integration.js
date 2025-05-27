/**
 * JOYO Burger - HighLevel CRM Integration
 * Handles form submissions to HighLevel API with fallback email notifications
 */

class HighLevelIntegration {
    constructor() {
        this.apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IjlsV2RqbjNKdmdIa2dyWWVYelVNIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ4Mzc4MjY5MzAxLCJzdWIiOiJ4QTVucmE2a1EyOHpFc3JjY21HYSJ9.D1kbn50UfpUew8SGJOPiF_upj7pmkdI7qmZmQXKMClU';
        this.locationId = '9lWdjn3JvgHkgrYeXzUM';
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Version': '2021-07-28',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    firstName: contactData.firstName || contactData.fullName?.split(' ')[0] || '',
                    lastName: contactData.lastName || contactData.fullName?.split(' ').slice(1).join(' ') || '',
                    email: contactData.email,
                    phone: contactData.phone,
                    locationId: this.locationId,
                    customFields: contactData.customFields || [],
                    tags: contactData.tags || []
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ HighLevel contact created:', result);
                return { success: true, data: result };
            } else {
                const errorText = await response.text();
                console.error('❌ HighLevel API Error:', response.status, errorText);
                throw new Error(`HighLevel API Error: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('❌ HighLevel submission failed:', error);
            
            // Send fallback email notification
            await this.sendFallbackEmail(contactData, error.message);
            
            throw error;
        }
    }

    /**
     * Send fallback email when HighLevel API fails
     */
    async sendFallbackEmail(contactData, errorMessage) {
        try {
            console.log('📧 Fallback email data:', {
                to: this.fallbackEmails,
                contactData,
                error: errorMessage,
                timestamp: new Date().toISOString()
            });
            
            // In a real implementation, you would integrate with an email service
            // For now, we'll just log the data that would be sent
            return { success: true, message: 'Fallback email logged' };
        } catch (error) {
            console.error('❌ Fallback email failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Show success message to user
     */
    showSuccessMessage(form, isVip = false) {
        const messageHtml = `
            <div class="form-success-message">
                <span class="success-icon">🎉</span>
                <h3>Thank You!</h3>
                <p>Your submission has been received successfully. ${isVip ? 'Welcome to the JOYO VIP family!' : 'We\'ll be in touch soon!'}</p>
                ${isVip ? '<p><strong>🎁 You\'re now part of our VIP community and will receive exclusive offers!</strong></p>' : ''}
            </div>
        `;
        
        form.innerHTML = messageHtml;
        
        // Scroll to message
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Show error message to user
     */
    showErrorMessage(form) {
        const messageHtml = `
            <div class="form-error-message">
                <span class="error-icon">⚠️</span>
                <h3>Oops! Something went wrong</h3>
                <p>We're having trouble processing your submission right now. Please try again in a few minutes or contact us directly at <a href="mailto:info@joyoburger.com">info@joyoburger.com</a></p>
                <button type="button" class="try-again-btn" onclick="location.reload()">TRY AGAIN</button>
            </div>
        `;
        
        form.innerHTML = messageHtml;
        
        // Scroll to message
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Handle newsletter form submission
     */
    async handleNewsletterSubmission(formData) {
        const contactData = {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            birthday: formData.get('birthday'),
            tags: ['joyo-vip'], // VIP tag for newsletter signups
            customFields: [
                {
                    key: 'birthday',
                    value: formData.get('birthday')
                },
                {
                    key: 'source',
                    value: 'Newsletter Signup'
                }
            ]
        };

        return await this.submitContact(contactData);
    }

    /**
     * Handle contact form submission
     */
    async handleContactSubmission(formData) {
        const contactData = {
            fullName: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            customFields: [
                {
                    key: 'message',
                    value: formData.get('comments')
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
}

// Initialize HighLevel integration
const highLevelIntegration = new HighLevelIntegration();

// Export for use in main.js
window.highLevelIntegration = highLevelIntegration; 