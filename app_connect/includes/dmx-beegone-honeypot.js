/**
 * BeeGone Honeypot — App Connect component
 * Registers with dmx.Component so Wappler App Connect recognises dmx-beegone-honeypot.
 */
(function () {
    'use strict';

    const HONEYPOT_CLASS = 'beegone-hp-field';
    const TS_CLASS = 'beegone-ts-field';
    const WRAP_CLASS = 'beegone-hp-wrap';
    const PLACEHOLDER_CLASS = 'beegone-design-placeholder';

    function isDesignView() {
        return !!(
            typeof document !== 'undefined' &&
            document.body &&
            (document.body.classList.contains('design-mode') ||
                document.body.classList.contains('wappler-design-mode'))
        );
    }

    function isPlaceholder(value) {
        return typeof value === 'string' && value.indexOf('@@') !== -1;
    }

    function propString(value, fallback) {
        if (value == null || value === '') return fallback;
        if (isPlaceholder(value)) return fallback;
        return String(value).trim();
    }

    function propInt(value, fallback) {
        const n = parseInt(propString(value, String(fallback)), 10);
        return Number.isFinite(n) && n >= 0 ? n : fallback;
    }

    function slugId(id) {
        return String(id || 'trap')
            .replace(/[^a-zA-Z0-9_]/g, '_')
            .replace(/^_+|_+$/g, '') || 'trap';
    }

    function buildStaticMarkup(fieldName, tsFieldName, designLabel, useTimestamp) {
        const hpId = fieldName + '_input';
        let html =
            '<div class="' + WRAP_CLASS + '" aria-hidden="true">' +
            '<label class="beegone-hp-label" for="' + hpId + '">' + designLabel + '</label>' +
            '<input type="text" name="' + fieldName + '" id="' + hpId + '" class="' + HONEYPOT_CLASS +
            '" tabindex="-1" autocomplete="off" inputmode="text" value="">';
        if (useTimestamp && tsFieldName) {
            const tsId = tsFieldName + '_input';
            html += '<input type="hidden" name="' + tsFieldName + '" id="' + tsId + '" class="' + TS_CLASS + '" value="">';
        }
        html += '</div>';
        return html;
    }

    dmx.Component('beegone-honeypot', {
        attributes: {
            fieldName: { type: String, default: '' },
            timestampFieldName: { type: String, default: '' },
            minSeconds: { type: Number, default: 3 },
            designLabel: { type: String, default: 'Leave empty' },
        },

        init(node) {
            this._node = node;
            this._wrap = null;
            this._honeypotInput = null;
            this._tsInput = null;
            this._render();
        },

        performUpdate() {
            this._render();
        },

        destroy() {
            this._removeInjected();
        },

        _removeInjected() {
            const node = this._node;
            if (!node) return;
            if (this._wrap && this._wrap.parentNode === node) {
                return;
            }
            if (this._wrap && this._wrap.parentNode) {
                this._wrap.parentNode.removeChild(this._wrap);
            }
            this._wrap = null;
            this._honeypotInput = null;
            this._tsInput = null;
        },

        _ensureStaticMarkup(node, fieldName, tsFieldName, designLabel, useTimestamp) {
            let wrap = node.querySelector('.' + WRAP_CLASS);
            if (!wrap) {
                node.insertAdjacentHTML('beforeend', buildStaticMarkup(fieldName, tsFieldName, designLabel, useTimestamp));
                wrap = node.querySelector('.' + WRAP_CLASS);
            }
            return wrap;
        },

        _syncFieldNames(wrap, fieldName, tsFieldName, designLabel, useTimestamp) {
            const hpLabel = wrap.querySelector('.beegone-hp-label');
            const hp = wrap.querySelector('.' + HONEYPOT_CLASS) || wrap.querySelector('input[type="text"]');
            let ts = wrap.querySelector('.' + TS_CLASS);

            if (hpLabel) {
                hpLabel.textContent = designLabel;
                hpLabel.setAttribute('for', fieldName + '_input');
            }

            if (hp) {
                hp.name = fieldName;
                hp.id = fieldName + '_input';
                if (hpLabel) hpLabel.setAttribute('for', hp.id);
                hp.value = hp.value || '';
            }

            if (useTimestamp && tsFieldName) {
                if (!ts) {
                    ts = document.createElement('input');
                    ts.type = 'hidden';
                    ts.className = TS_CLASS;
                    wrap.appendChild(ts);
                }
                ts.name = tsFieldName;
                ts.id = tsFieldName + '_input';
                if (!ts.value) ts.value = String(Date.now());
                this._tsInput = ts;
            } else if (ts && ts.parentNode) {
                ts.parentNode.removeChild(ts);
                ts = null;
                this._tsInput = null;
            }

            this._wrap = wrap;
            this._honeypotInput = hp;
            return wrap;
        },

        _showDesignPlaceholder(node, fieldName, tsFieldName, useTimestamp) {
            let ph = node.querySelector('.' + PLACEHOLDER_CLASS);
            if (!ph) {
                ph = document.createElement('div');
                ph.className = PLACEHOLDER_CLASS;
                ph.setAttribute('aria-hidden', 'false');
                node.insertBefore(ph, node.firstChild);
            }
            ph.innerHTML =
                '<span class="beegone-design-icon" aria-hidden="true">🐝</span> ' +
                '<strong>BeeGone honeypot</strong> - field <code>' + fieldName + '</code>' +
                (useTimestamp ? ', timestamp <code>' + tsFieldName + '</code>' : '') +
                '<br><small>Trap inputs stay in the form HTML for Server Connect import. Hidden on the live site.</small>';

            const wrap = node.querySelector('.' + WRAP_CLASS);
            if (wrap) wrap.classList.add('beegone-hp-wrap--design-hidden');
        },

        _hideDesignPlaceholder(node) {
            const ph = node.querySelector('.' + PLACEHOLDER_CLASS);
            if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
            const wrap = node.querySelector('.' + WRAP_CLASS);
            if (wrap) wrap.classList.remove('beegone-hp-wrap--design-hidden');
        },

        _injectLegacy(node, fieldName, tsFieldName, designLabel, useTimestamp) {
            const form = node.closest('form');
            if (!form) {
                node.insertAdjacentHTML(
                    'beforeend',
                    '<div class="' + PLACEHOLDER_CLASS + ' ' + PLACEHOLDER_CLASS + '--warn">' +
                    'BeeGone: no parent &lt;form&gt; found. Move this component inside your form.' +
                    '</div>'
                );
                return;
            }

            const wrap = document.createElement('div');
            wrap.className = WRAP_CLASS;
            wrap.setAttribute('aria-hidden', 'true');
            wrap.innerHTML = buildStaticMarkup(fieldName, tsFieldName, designLabel, useTimestamp)
                .replace(/^<div class="beegone-hp-wrap"[^>]*>/, '')
                .replace(/<\/div>$/, '');

            form.appendChild(wrap);
            this._wrap = wrap;
            this._honeypotInput = wrap.querySelector('.' + HONEYPOT_CLASS);
            this._tsInput = wrap.querySelector('.' + TS_CLASS);
            if (this._tsInput && !this._tsInput.value) {
                this._tsInput.value = String(Date.now());
            }
        },

        _render() {
            const node = this._node;
            if (!node) return;

            const compId = node.id || 'beegone';
            const fieldName = propString(this.props.fieldName, 'beegone_' + slugId(compId));
            const tsFieldName = propString(this.props.timestampFieldName, 'beegone_ts_' + slugId(compId));
            const minSeconds = propInt(this.props.minSeconds, 0);
            const designLabel = propString(this.props.designLabel, 'Leave empty');
            const useTimestamp =
                minSeconds > 0 ||
                propString(this.props.timestampFieldName, '') !== '' ||
                node.hasAttribute('timestamp-field-name');

            if (isDesignView()) {
                this._ensureStaticMarkup(node, fieldName, tsFieldName, designLabel, useTimestamp);
                this._syncFieldNames(
                    node.querySelector('.' + WRAP_CLASS),
                    fieldName,
                    tsFieldName,
                    designLabel,
                    useTimestamp
                );
                this._showDesignPlaceholder(node, fieldName, tsFieldName, useTimestamp);
                return;
            }

            this._hideDesignPlaceholder(node);

            const wrap = node.querySelector('.' + WRAP_CLASS);
            if (wrap) {
                this._syncFieldNames(wrap, fieldName, tsFieldName, designLabel, useTimestamp);
                return;
            }

            this._injectLegacy(node, fieldName, tsFieldName, designLabel, useTimestamp);
        },
    });
})();
