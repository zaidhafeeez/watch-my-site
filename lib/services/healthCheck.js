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
        // HTTP Check with headers
        const response = await axios.get(site.url, {
            timeout: 10000,
            validateStatus: null,
            headers: {
                'User-Agent': 'WatchMySite Health Monitor'
            }
        });

        results.responseTime = Date.now() - startTime;
        results.status = response.status >= 200 && response.status < 400 ? 'healthy' : 'down';
        results.headers = response.headers;
        results.statusCode = response.status;

        // SSL Check
        const { protocol, hostname } = parseUrl(site.url);
        if (protocol === 'https:') {
            try {
                const sslInfo = await axios.get(`https://api.ssllabs.com/api/v3/analyze`, {
                    params: { host: hostname, publish: 'off', startNew: 'off' }
                });
                results.ssl = {
                    valid: true,
                    grade: sslInfo.data?.endpoints?.[0]?.grade || null,
                    expiryDate: sslInfo.data?.certs?.[0]?.notAfter || null
                };
            } catch (e) {
                results.ssl = { valid: false, error: e.message };
            }
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
