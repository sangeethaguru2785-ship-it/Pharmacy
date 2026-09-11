/* ========================================
   Stackly Pharmacy - Auth (Login / Sign Up)
   Password toggles, strength meter, demo submit
   ======================================== */
(function () {
    'use strict';

    /* ---- Password visibility toggle ---- */
    document.querySelectorAll('[data-password-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var target = document.querySelector(btn.getAttribute('data-password-toggle'));
            if (!target) return;
            var show = target.type === 'password';
            target.type = show ? 'text' : 'password';
            var icon = btn.querySelector('i');
            icon.classList.toggle('bi-eye', !show);
            icon.classList.toggle('bi-eye-slash', show);
            btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
            btn.setAttribute('aria-pressed', String(show));
        });
    });

    /* ---- Password strength meter (sign up) ---- */
    var strengthInput = document.querySelector('[data-strength]');
    if (strengthInput) {
        var meter = document.querySelector(strengthInput.getAttribute('data-strength'));
        var levelEl = meter ? meter.querySelector('.password-level') : null;
        var fillEl = meter ? meter.querySelector('.password-fill') : null;

        var labels = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'];

        strengthInput.addEventListener('input', function () {
            var v = strengthInput.value;
            var score = 0;
            if (v.length >= 8) score++;
            if (/[A-Z]/.test(v)) score++;
            if (/[0-9]/.test(v)) score++;
            if (/[^A-Za-z0-9]/.test(v)) score++;
            if (levelEl) levelEl.textContent = 'Strength: ' + labels[score];
            if (fillEl) {
                fillEl.style.width = (score * 25) + '%';
                fillEl.className = 'password-fill' + (score <= 1 ? ' weak' : score === 2 ? ' ok' : ' strong');
            }
        });
    }

    /* ---- Password requirements (login + sign up) ---- */
    function passwordErrors(value) {
        var v = String(value || '');
        if (!v) { return 'Please enter your password.'; }
        var missing = [];
        if (!/[A-Z]/.test(v)) { missing.push('one uppercase letter (A\u2013Z)'); }
        if (!/[a-z]/.test(v)) { missing.push('one lowercase letter (a\u2013z)'); }
        if (!/[0-9]/.test(v)) { missing.push('one number (0\u20139)'); }
        if (!/[^A-Za-z0-9]/.test(v)) { missing.push('one special character (e.g. @ # $ % !)'); }
        if (missing.length) { return 'Password must include at least ' + missing.join(', ') + '.'; }
        return '';
    }

    function showPasswordError(input, msg) {
        if (!input) { return; }
        input.classList.toggle('field-invalid', !!msg);
        var el = input._passwordMsg;
        if (el) {
            el.textContent = msg || '';
            el.classList.toggle('show', !!msg);
        }
    }

    function attachPasswordValidation(input) {
        if (!input) { return; }
        var host = input.closest('.input-wrap');
        var msg = document.createElement('small');
        msg.className = 'field-error-msg';
        msg.setAttribute('aria-live', 'polite');
        if (host) { host.insertAdjacentElement('afterend', msg); }
        else { input.insertAdjacentElement('afterend', msg); }
        input._passwordMsg = msg;

        input.addEventListener('input', function () {
            var v = input.value;
            showPasswordError(input, v ? passwordErrors(v) : '');
        });

        input.addEventListener('blur', function () {
            var v = input.value;
            if (!v) {
                showPasswordError(input, input.required ? 'Please enter your password.' : '');
            } else {
                showPasswordError(input, passwordErrors(v));
            }
        });
    }

    attachPasswordValidation(document.getElementById('loginPassword'));
    attachPasswordValidation(document.getElementById('suPassword'));

    /* ---- Demo form submit with role selection ---- */
    function selectedRole(form) {
        var radio = form.querySelector('input[name="authRole"]:checked');
        return radio ? radio.value : null;
    }

    function readUsers() {
        try {
            var list = JSON.parse(localStorage.getItem('hp_users') || '[]');
            return Array.isArray(list) ? list : [];
        } catch (e) { return []; }
    }

    function writeUsers(users) {
        try { localStorage.setItem('hp_users', JSON.stringify(users)); } catch (e) { /* storage unavailable */ }
    }

    function findUserByEmail(users, email) {
        if (!email) { return null; }
        var target = email.trim().toLowerCase();
        for (var i = 0; i < users.length; i++) {
            if (users[i].email && users[i].email.trim().toLowerCase() === target) { return users[i]; }
        }
        return null;
    }

    function saveSession(form, role) {
        var isSignup = !!form.querySelector('#suName');
        var nameInput = form.querySelector('#suName, #loginName');
        var emailInput = form.querySelector('#suEmail, #loginEmail');
        var user = { role: role };
        var email = emailInput && emailInput.value ? emailInput.value.trim() : '';
        var users = readUsers();

        if (email && !isValidEmail(email)) { return false; }

        if (email) { user.email = email; }

        if (isSignup && nameInput && nameInput.value) {
            var name = nameInput.value.trim();
            user.name = name;
            var existing = findUserByEmail(users, email);
            if (existing) {
                existing.name = name;
                existing.role = role;
            } else if (email) {
                users.push({ name: name, email: email, role: role });
            }
            writeUsers(users);
        } else {
            var found = findUserByEmail(users, email);
            if (found && found.name) { user.name = found.name; }
            else if (email) { user.name = nameFromEmail(email); }
        }

        try {
            localStorage.setItem('hp_user', JSON.stringify(user));
        } catch (e) { /* storage unavailable */ }
        return true;
    }

    function nameFromEmail(email) {
        var local = String(email).split('@')[0] || '';
        var parts = local.split(/[._\-+]+/);
        var out = [];
        for (var i = 0; i < parts.length; i++) {
            if (!parts[i]) { continue; }
            out.push(parts[i].charAt(0).toUpperCase() + parts[i].slice(1));
        }
        return out.join(' ');
    }

    /* ---- Strict email rule (same as main.js shared validator) ---- */
    function emailError(value) {
        var v = String(value || '').trim();
        if (!v) { return 'Please enter your email address.'; }
        if (/\s/.test(v)) { return 'Email address cannot contain spaces.'; }
        if (!/^[A-Za-z0-9.@]+$/.test(v)) { return 'Only letters, numbers, dots (.) and @ are allowed in an email address.'; }
        if (!/^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*@[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+$/.test(v)) { return 'Please enter a valid email address, like user123@gmail.com.'; }
        return '';
    }

    function isValidEmail(value) {
        if (window.StacklyEmail && typeof window.StacklyEmail.isValid === 'function') {
            return window.StacklyEmail.isValid(value);
        }
        return emailError(value) === '';
    }

    function showEmailError(input) {
        if (!input) { return; }
        var msg = emailError(input.value);
        if (window.StacklyEmail && typeof window.StacklyEmail.showError === 'function') {
            window.StacklyEmail.showError(input, msg);
        } else {
            input.classList.toggle('field-invalid', !!msg);
        }
    }

    document.querySelectorAll('.auth-form').forEach(function (form) {
        /* Remember Me requirement (sign in only) */
        var rememberInput = form.querySelector('#rememberMe');
        var rememberMsg = null;
        if (rememberInput) {
            rememberMsg = document.createElement('small');
            rememberMsg.className = 'field-error-msg';
            rememberMsg.setAttribute('aria-live', 'polite');
            rememberMsg.textContent = 'Please select \u201CRemember Me\u201D to continue.';
            var row = rememberInput.closest('.auth-row') || form;
            row.insertAdjacentElement('afterend', rememberMsg);
            rememberInput.addEventListener('change', function () {
                if (rememberInput.checked) {
                    rememberMsg.classList.remove('show');
                    rememberInput.classList.remove('field-invalid');
                }
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }

            var roleSel = form.querySelector('.role-selector');
            var role = selectedRole(form);
            if (!role) {
                if (roleSel) { roleSel.classList.add('invalid'); roleSel.focus(); }
                return;
            }
            if (roleSel) { roleSel.classList.remove('invalid'); }

            var emailInput = form.querySelector('#suEmail, #loginEmail');
            var emailMsg = emailInput ? emailError(emailInput.value) : '';
            if (emailMsg) {
                showEmailError(emailInput);
                if (emailInput) { emailInput.focus(); }
                return;
            }

            var passInput = form.querySelector('#loginPassword, #suPassword');
            var passMsg = passInput ? passwordErrors(passInput.value) : '';
            if (passMsg) {
                showPasswordError(passInput, passMsg);
                if (passInput) { passInput.focus(); }
                return;
            }

            /* Remember Me must be selected before signing in */
            if (rememberInput) {
                if (!rememberInput.checked) {
                    if (rememberMsg) { rememberMsg.classList.add('show'); }
                    rememberInput.classList.add('field-invalid');
                    rememberInput.focus();
                    return;
                }
                if (rememberMsg) { rememberMsg.classList.remove('show'); }
                rememberInput.classList.remove('field-invalid');
            }

            var btn = form.querySelector('[type="submit"]');
            btn.classList.add('is-success');

            if (!saveSession(form, role)) { btn.classList.remove('is-success'); return; }

            setTimeout(function () {
                window.location.href = role === 'admin' ? 'admin-dashboard.html' : 'customer-dashboard.html';
            }, 900);
        });
    });
})();