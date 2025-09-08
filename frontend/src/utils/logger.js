
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiMjJjbjAwOUBraXRzdy5hYy5pbiIsImV4cCI6MTc1NzMwODUzNywiaWF0IjoxNzU3MzA3NjM3LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNTQ4YmY5ZjgtMDcwNC00ZWY1LWJlM2MtMzdmMjAzZWFhMGUzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FpIHByYWR5dW1uYSBnb3VkIGNoaXJhZ29uaSIsInN1YiI6IjQzY2IxZDQ0LTY0MDItNDgwYi1iMTJiLWFhY2MyOGJlNDdlNCJ9LCJlbWFpbCI6ImIyMmNuMDA5QGtpdHN3LmFjLmluIiwibmFtZSI6InNhaSBwcmFkeXVtbmEgZ291ZCBjaGlyYWdvbmkiLCJyb2xsTm8iOiJiMjJjbjAwOSIsImFjY2Vzc0NvZGUiOiJxcVF6WmsiLCJjbGllbnRJRCI6IjQzY2IxZDQ0LTY0MDItNDgwYi1iMTJiLWFhY2MyOGJlNDdlNCIsImNsaWVudFNlY3JldCI6InFBQUREeW1FUk5Tc2NURnUifQ.MIkfGmW-kgulXrULGDFWK4D8KwH1UNKHf8xjEWQzhi8';

const LOG_API_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

const sendLog = async (level, message, component) => {
    const logData = {
        stack: 'frontend',
        level: 'info',
        package: 'api',
        message: 'test message'
    };

    try {
        const response = await fetch(LOG_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(logData),
        });

        if (!response.ok) {
            console.error(`Failed to send log. Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending log:', error);
    }
};

const logger = {
    info: (message, component = 'app') => sendLog('info', message, component),
    error: (message, component = 'app') => sendLog('error', message, component),
    warn: (message, component = 'app') => sendLog('warn', message, component),

};

export default logger;