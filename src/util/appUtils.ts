import axios from 'axios';

async function getIPAddress(): Promise<string> {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return '';
    }
}

export { getIPAddress };