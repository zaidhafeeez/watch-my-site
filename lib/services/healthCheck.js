import axios from 'axios';
import { parse as parseUrl } from 'url';
import dns from 'dns';
import { promisify } from 'util';

const dnsResolve = promisify(dns.resolve);

export async function performAdvancedHealthCheck(site) {
    const startTime = Date.now();
    const results = {
        status: 'down',
        responseTime: 0,
        ssl: null,
        dns: null,
        headers: null,
        error: null
    };

    try {
        // HTTP Check with headers and longer timeout
        const response = await axios.get(site.url, {
            timeout: 30000, // Increased timeout to 30 seconds
            validateStatus: null, // Accept all status codes
            headers: {
                'User-Agent': 'WatchMySite Health Monitor/1.0',
                'Accept': '*/*'
            },
            maxRedirects: 5
        });

        results.responseTime = Date.now() - startTime;
        // Consider 2xx and 3xx as healthy
        results.status = (response.status >= 200 && response.status < 400) ? 'up' : 'down';
        results.headers = response.headers;
        results.statusCode = response.status;

        // Simplified SSL check
        const { protocol } = parseUrl(site.url);
        if (protocol === 'https:') {
            results.ssl = {
                valid: true,
                protocol: response.headers['server'] || 'Unknown'
            };
        }

        // DNS Check
        try {
            const dnsRecords = await dnsResolve(hostname, 'A');
            results.dns = {
                resolved: true,
                records: dnsRecords
            };
        } catch (e) {
            results.dns = { resolved: false, error: e.message };
        }

    } catch (error) {
        results.error = error.message;
        results.status = 'down';
        results.responseTime = Date.now() - startTime;
    }

    return results;
}
