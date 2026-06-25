/**
 * beegone.js — honeypot validation for Wappler Server Connect (Node).
 * Pair with App Connect dmx-beegone-honeypot on the form.
 */

const ON_BOT_MODES = new Set(['flag', 'reject', 'silent']);

/**
 * @param {unknown} raw
 * @returns {number}
 */
function parseMinSeconds(raw) {
    const n = parseInt(String(raw), 10);
    if (!Number.isFinite(n) || n < 0) return 0;
    return Math.min(n, 3600);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function normalizeValue(value) {
    if (value == null) return '';
    return String(value).trim();
}

/**
 * @param {object} options
 * @param {string} [options.honeypotValue]
 * @param {string} [options.expectedValue]
 * @param {number|string} [options.minSeconds]
 * @param {string} [options.timestampValue]
 * @param {string} [options.onBot] flag | reject | silent
 * @returns {{ passed: boolean, isBot: boolean, reason: string }}
 */
exports.validate = function (options) {
    const honeypotValue = this.parseOptional(options.honeypotValue, '*', '');
    const expectedValue = this.parseOptional(options.expectedValue, '*', '');
    const minSeconds = parseMinSeconds(this.parseOptional(options.minSeconds, '*', '0'));
    const timestampValue = this.parseOptional(options.timestampValue, '*', '');
    const onBot = this.parseOptional(options.onBot, 'string', 'flag');

    let passed = true;
    let reason = '';

    const actual = normalizeValue(honeypotValue);
    const expected = normalizeValue(expectedValue);

    if (actual !== expected) {
        passed = false;
        reason = 'honeypot_filled';
    }

    if (passed && minSeconds > 0) {
        const tsRaw = normalizeValue(timestampValue);
        if (!tsRaw) {
            passed = false;
            reason = 'invalid_timestamp';
        } else {
            const ts = parseInt(tsRaw, 10);
            if (!Number.isFinite(ts) || ts <= 0) {
                passed = false;
                reason = 'invalid_timestamp';
            } else {
                const elapsed = (Date.now() - ts) / 1000;
                if (elapsed < minSeconds) {
                    passed = false;
                    reason = 'submitted_too_fast';
                }
            }
        }
    }

    const isBot = !passed;
    const mode = ON_BOT_MODES.has(onBot) ? onBot : 'flag';

    if (isBot && mode === 'reject') {
        throw new Error('BeeGone: request blocked (honeypot validation failed).');
    }

    return {
        passed,
        isBot,
        reason: passed ? '' : reason
    };
};

exports._parseMinSeconds = parseMinSeconds;
exports._normalizeValue = normalizeValue;
