interface EmailTransport {
    host: string;
    port: string;
    auth: {
        user: string;
        pass: string;
    };
}

interface EmailTemplateDefaults {
    header: {
        logoUrl: string;
    };
}

interface EmailConfig {
    transport: EmailTransport;
    sender: string;
    exceptionEmailRecipients: string;
    templateDefaults: EmailTemplateDefaults;
}

const emailConfig: EmailConfig = {
    transport: {
        host: process.env.SMTP_HOST ?? '',
        port: process.env.SMTP_PORT ?? '',
        auth: {
            user: process.env.SMTP_AUTH_USERNAME ?? '',
            pass: process.env.SMTP_AUTH_PASSWORD ?? '',
        },
    },
    sender: process.env.SMTP_EMAIL_SENDER ?? '',
    exceptionEmailRecipients: process.env.SMTP_EXCEPTION_EMAIL_RECIPIENTS ?? '',
    templateDefaults: {
        header: {
            logoUrl: process.env.SMTP_EMAIL_TEMPLATE_HEADER_IMAGE_PATH ?? '',
        },
    },
};

export default emailConfig;
