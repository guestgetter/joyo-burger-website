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
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Version': '2021-07-28'
                },
                body: JSON.stringify({
                    locationId: this.locationId,
                    firstName: contactData.firstName || '',
                    lastName: contactData.lastName || '',
                    name: contactData.name || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
                    email: contactData.email,
                    phone: contactData.phone,
                    dateOfBirth: contactData.birthday || null,
                    tags: contactData.tags || [],
                    customFields: contactData.customFields || {},
                    source: contactData.source || 'Website'
                })
            });

            if (!response.ok) {
                throw new Error(`HighLevel API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Contact successfully added to HighLevel:', result);
            
            // Send fallback email notification
            await this.sendFallbackEmail(contactData);
            
            return { success: true, data: result };
        } catch (error) {
            console.error('HighLevel submission failed:', error);
            
            // Send fallback email on API failure
            await this.sendFallbackEmail(contactData, error.message);
            
            return { success: false, error: error.message };
        }
    }

    /**
     * Send fallback email notification
     */
    async sendFallbackEmail(contactData, errorMessage = null) {
        const emailData = {
            to: this.fallbackEmails,
            subject: errorMessage ? 
                `[URGENT] JOYO Form Submission - HighLevel API Failed` : 
                `New JOYO ${contactData.formType} Submission`,
            body: this.formatEmailBody(contactData, errorMessage)
        };

        // Note: In a production environment, you would implement actual email sending
        // For now, we'll log the email data
        console.log('Fallback email data:', emailData);
        
        // You could integrate with a service like EmailJS, SendGrid, or similar here
        return emailData;
    }

    /**
     * Format email body for fallback notifications
     */
    formatEmailBody(contactData, errorMessage = null) {
        let body = `
New ${contactData.formType} submission from JOYO Burger website:

Name: ${contactData.name || 'Not provided'}
Email: ${contactData.email}
Phone: ${contactData.phone || 'Not provided'}
`;

        if (contactData.birthday) {
            body += `Birthday: ${contactData.birthday}\n`;
        }

        if (contactData.comments) {
            body += `Comments: ${contactData.comments}\n`;
        }

        if (contactData.tags && contactData.tags.length > 0) {
            body += `Tags: ${contactData.tags.join(', ')}\n`;
        }

        body += `Source: ${contactData.source || 'Website'}\n`;
        body += `Timestamp: ${new Date().toISOString()}\n`;

        if (errorMessage) {
            body += `\n⚠️ ERROR: HighLevel API failed with error: ${errorMessage}\n`;
            body += `Please manually add this contact to HighLevel CRM.\n`;
        }

        return body;
    }

    /**
     * Handle newsletter form submission
     */
    async handleNewsletterSubmission(formData) {
        const contactData = {
            formType: 'Newsletter Signup',
            firstName: this.extractFirstName(formData.get('fullName')),
            lastName: this.extractLastName(formData.get('fullName')),
            name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            birthday: formData.get('birthday'),
            tags: ['joyo-vip'], // VIP tag for newsletter signups
            source: 'Website - Newsletter',
            customFields: {
                'newsletter_signup': 'true',
                'birthday_burger_eligible': 'true'
            }
        };

        return await this.submitContact(contactData);
    }

    /**
     * Handle contact form submission
     */
    async handleContactSubmission(formData) {
        const isVipOptIn = formData.get('newsletter') === 'on';
        const tags = isVipOptIn ? ['joyo-vip'] : [];

        const contactData = {
            formType: 'Contact Form',
            name: formData.get('name'),
            firstName: this.extractFirstName(formData.get('name')),
            lastName: this.extractLastName(formData.get('name')),
            email: formData.get('email'),
            phone: formData.get('phone'),
            comments: formData.get('comments'),
            tags: tags,
            source: 'Website - Contact Form',
            customFields: {
                'contact_form_submission': 'true',
                'vip_opt_in': isVipOptIn ? 'true' : 'false',
                'comments': formData.get('comments') || ''
            }
        };

        return await this.submitContact(contactData);
    }

    /**
     * Extract first name from full name
     */
    extractFirstName(fullName) {
        if (!fullName) return '';
        return fullName.split(' ')[0] || '';
    }

    /**
     * Extract last name from full name
     */
    extractLastName(fullName) {
        if (!fullName) return '';
        const parts = fullName.split(' ');
        return parts.length > 1 ? parts.slice(1).join(' ') : '';
    }

    /**
     * Show success message
     */
    showSuccessMessage(container, formType) {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <h3>Thank You!</h3>
            <p>${formType === 'Newsletter Signup' ? 
                'Welcome to the JOYO family! You\'re now signed up for updates and your free birthday burger.' : 
                'Your message has been sent successfully. We\'ll get back to you soon!'
            }</p>
        `;
        
        container.innerHTML = '';
        container.appendChild(successMessage);
    }

    /**
     * Show error message
     */
    showErrorMessage(container, errorMessage) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.innerHTML = `
            <div class="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>We're having trouble processing your submission right now. Please try again in a few minutes or contact us directly at <a href="mailto:info@joyoburger.com">info@joyoburger.com</a>.</p>
            <button type="button" class="retry-btn" onclick="location.reload()">Try Again</button>
        `;
        
        container.appendChild(errorDiv);
    }
}

// Initialize HighLevel integration
const highLevel = new HighLevelIntegration();

// Export for use in other scripts
window.HighLevelIntegration = HighLevelIntegration;
window.highLevel = highLevel; 