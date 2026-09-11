(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        var body = document.body;

        /* ---------- Logout: clear active session ---------- */
        document.querySelectorAll('.dash-logout').forEach(function (logout) {
            logout.addEventListener('click', function () {
                try { localStorage.removeItem('hp_user'); } catch (e) { /* ignore */ }
            });
        });

        /* ---------- Logged-in user display ---------- */
        (function () {
            var user = null;
            try { user = JSON.parse(localStorage.getItem('hp_user') || 'null'); } catch (e) { user = null; }
            if (!user || typeof user !== 'object') { return; }

            function setField(el, value) {
                if (!el) { return; }
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.value = value;
                } else {
                    el.textContent = value;
                }
            }

            function firstName(name) {
                return (name || '').trim().split(/\s+/)[0] || '';
            }

            function initials(name) {
                var parts = (name || '').trim().split(/\s+/);
                if (!parts[0]) { return 'U'; }
                var out = parts[0].charAt(0).toUpperCase();
                if (parts.length > 1) { out += parts[parts.length - 1].charAt(0).toUpperCase(); }
                return out;
            }

            var displayName = user.name || nameFromEmail(user.email);
            var nameEls = document.querySelectorAll('[data-user-name]');
            var greetEls = document.querySelectorAll('[data-user-greet]');
            var avatarEls = document.querySelectorAll('[data-user-avatar]');
            var emailEls = document.querySelectorAll('[data-user-email]');
            var roleEls = document.querySelectorAll('[data-user-role]');

            nameEls.forEach(function (el) { setField(el, displayName); });
            greetEls.forEach(function (el) { setField(el, firstName(displayName)); });
            avatarEls.forEach(function (el) { el.textContent = initials(displayName); });
            emailEls.forEach(function (el) { setField(el, user.email || ''); });
            roleEls.forEach(function (el) { setField(el, user.role === 'admin' ? 'Super Admin' : 'Customer'); });
        })();

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

        /* ---------- Mobile sidebar toggle ---------- */
        var burger = document.querySelector('.dash-burger');
        var overlay = document.querySelector('.dash-overlay');

        function closeSidebar() {
            body.classList.remove('sidebar-open');
        }

        if (burger) {
            burger.addEventListener('click', function () {
                body.classList.toggle('sidebar-open');
            });
        }
        if (overlay) {
            overlay.addEventListener('click', closeSidebar);
        }

        /* ---------- Panel navigation ---------- */
        var links = document.querySelectorAll('.dash-link[data-panel]');
        var panels = document.querySelectorAll('.dash-panel');

        links.forEach(function (link) {
            link.addEventListener('click', function () {
                var target = link.getAttribute('data-panel');
                links.forEach(function (l) {
                    l.classList.toggle('active', l === link);
                });
                panels.forEach(function (p) {
                    p.classList.toggle('active', p.id === 'panel-' + target);
                });
                closeSidebar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        /* ---------- Quantity controls ---------- */
        document.querySelectorAll('.qty-control').forEach(function (q) {
            var val = q.querySelector('.qty-val');
            var minus = q.querySelector('[data-qty="minus"]');
            var plus = q.querySelector('[data-qty="plus"]');
            if (val && minus) {
                minus.addEventListener('click', function () {
                    var v = parseInt(val.textContent, 10) || 1;
                    if (v > 1) { val.textContent = v - 1; }
                });
            }
            if (val && plus) {
                plus.addEventListener('click', function () {
                    var v = parseInt(val.textContent, 10) || 1;
                    val.textContent = v + 1;
                });
            }
        });

        /* ---------- Select all checkboxes ---------- */
        document.querySelectorAll('[data-select-all]').forEach(function (cb) {
            cb.addEventListener('change', function () {
                var group = document.querySelectorAll('.' + cb.getAttribute('data-select-all'));
                group.forEach(function (row) {
                    row.checked = cb.checked;
                });
            });
        });

        /* ---------- Deep links (e.g. #products) ---------- */
        function activatePanel(name) {
            var match = null;
            links.forEach(function (l) {
                var ok = l.getAttribute('data-panel') === name;
                l.classList.toggle('active', ok);
                if (ok) { match = l; }
            });
            panels.forEach(function (p) {
                p.classList.toggle('active', p.id === 'panel-' + name);
            });
            if (match) {
                match.scrollIntoView({ block: 'nearest' });
            }
        }

        var hash = window.location.hash.replace('#', '');
        if (hash) { activatePanel(hash); }

        /* ---------- Other small helpers (live) ---------- */
        document.querySelectorAll('.js-switch-panel').forEach(function (el) {
            el.addEventListener('click', function () {
                var target = el.getAttribute('data-panel');
                if (!target) { return; }
                links.forEach(function (l) {
                    l.classList.toggle('active', l.getAttribute('data-panel') === target);
                });
                panels.forEach(function (p) {
                    p.classList.toggle('active', p.id === 'panel-' + target);
                });
                closeSidebar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        /* ---------- Content buttons/links -> 404 page (Header & Sidebar unaffected) ---------- */
        document.querySelectorAll('.dash-content a, .dash-content button').forEach(function (el) {
            /* Keep in-page functional controls (quantity + / -) working */
            if (el.closest('.qty-control')) { return; }

            el.addEventListener('click', function (e) {
                e.preventDefault();
                window.location.href = '404.html';
            });
        });

        /* ---------- Dashboard charts (Chart.js) ---------- */
        if (window.Chart) {
            var GREEN = '#7C3AED';
            var GREEN_LIGHT = '#A78BFA';
            var GREEN_MID = '#C4B5FD';
            var GREEN_DARK = '#3B0764';
            var GREEN_DEEP = '#2E1065';
            var AMBER = '#F59E0B';
            var BLUE = '#2563EB';
            var RED = '#EF4444';
            var GRAY = '#6B7280';
            var GRID_COLOR = 'rgba(107, 114, 128, 0.12)';

            Chart.defaults.font.family = '"Plus Jakarta Sans", "Poppins", sans-serif';
            Chart.defaults.color = GRAY;

            function moneyLabel(v) {
                return '$' + Number(v).toLocaleString('en-US');
            }

            function lineArea(context) {
                var g = context.chart.ctx.createLinearGradient(0, 0, 0, 280);
                g.addColorStop(0, 'rgba(124, 58, 237, 0.28)');
                g.addColorStop(1, 'rgba(124, 58, 237, 0.02)');
                return g;
            }

            function doughnutConfig(labels, data, colors) {
                return {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{ data: data, backgroundColor: colors, borderColor: '#ffffff', borderWidth: 3, hoverOffset: 8 }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '64%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: { boxWidth: 10, boxHeight: 10, padding: 14, font: { size: 11 } }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (ctx) {
                                        var total = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                                        var pct = total ? Math.round((ctx.parsed / total) * 100) : 0;
                                        return ' ' + ctx.label + ': ' + ctx.parsed.toLocaleString('en-US') + ' (' + pct + '%)';
                                    }
                                }
                            }
                        }
                    }
                };
            }

            function makeChart(id, config) {
                var el = document.getElementById(id);
                if (el) { new Chart(el, config); }
            }

            /* Admin: Sales / Revenue Overview (line) */
            makeChart('adminRevenueChart', {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Sales revenue',
                        data: [6200, 7800, 7100, 9400, 10300, 11900, 12800, 14600],
                        borderColor: GREEN,
                        backgroundColor: lineArea,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: GREEN_DARK,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: function (ctx) { return ' Sales revenue: ' + moneyLabel(ctx.parsed.y); } } }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: function (v) { return '$' + v / 1000 + 'k'; } },
                            grid: { color: GRID_COLOR }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });

            /* Admin: Orders Overview (bar) */
            makeChart('adminOrdersChart', {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                    datasets: [{
                        label: 'Orders',
                        data: [790, 848, 822, 942, 1015, 1106, 1180, 1284],
                        backgroundColor: GREEN,
                        hoverBackgroundColor: GREEN_DARK,
                        borderRadius: 8,
                        maxBarThickness: 38
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: function (ctx) { return ' Orders: ' + ctx.parsed.y.toLocaleString('en-US'); } } }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: function (v) { return v.toLocaleString('en-US'); } },
                            grid: { color: GRID_COLOR }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });

            /* Admin: Order Status (doughnut) */
            makeChart('adminOrderStatusChart', doughnutConfig(
                ['Delivered', 'Processing', 'Pending', 'Cancelled'],
                [610, 238, 172, 84],
                [GREEN, AMBER, GRAY, RED]
            ));

            /* Admin: Product Categories (doughnut) */
            makeChart('adminCategoriesChart', doughnutConfig(
                ['Medicines', 'Vitamins & Supplements', 'Skin Care', 'Personal Care', 'Baby Care', 'Medical Devices'],
                [642, 318, 204, 176, 112, 84],
                [GREEN, GREEN_LIGHT, GREEN_DARK, GREEN_MID, AMBER, BLUE]
            ));

            /* Admin: Top Selling Medicines (horizontal bar) */
            makeChart('adminTopProductsChart', {
                type: 'bar',
                data: {
                    labels: ['Paracetamol 500mg', 'Vitamin D3 2000 IU', 'Daily Multivitamin', 'Hydrating Face Cream', 'Pain Relief Gel'],
                    datasets: [{
                        label: 'Units sold',
                        data: [1240, 860, 512, 288, 512],
                        backgroundColor: [GREEN, GREEN_LIGHT, GREEN_DARK, BLUE, AMBER],
                        hoverBackgroundColor: GREEN_DEEP,
                        borderRadius: 6,
                        maxBarThickness: 20
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: function (ctx) { return ' Units sold: ' + ctx.parsed.x.toLocaleString('en-US'); } } }
                    },
                    scales: {
                        x: { beginAtZero: true, grid: { color: GRID_COLOR } },
                        y: { grid: { display: false } }
                    }
                }
            });

            /* Customer: My Orders Overview (bar) */
            makeChart('custOrdersChart', {
                type: 'bar',
                data: {
                    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    datasets: [{
                        label: 'Orders placed',
                        data: [1, 2, 2, 3, 5, 1],
                        backgroundColor: GREEN,
                        hoverBackgroundColor: GREEN_DARK,
                        borderRadius: 8,
                        maxBarThickness: 38
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: function (ctx) { return ' Orders: ' + ctx.parsed.y; } } }
                    },
                    scales: {
                        y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: GRID_COLOR } },
                        x: { grid: { display: false } }
                    }
                }
            });

            /* Customer: Spending Overview (line) */
            makeChart('custSpendingChart', {
                type: 'line',
                data: {
                    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                    datasets: [{
                        label: 'Amount spent',
                        data: [54.90, 87.40, 98.60, 112.20, 206.70, 198.20],
                        borderColor: GREEN,
                        backgroundColor: lineArea,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: GREEN_DARK,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: function (ctx) { return ' Amount spent: ' + moneyLabel(ctx.parsed.y); } } }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: { callback: function (v) { return '$' + v; } },
                            grid: { color: GRID_COLOR }
                        },
                        x: { grid: { display: false } }
                    }
                }
            });

            /* Customer: Order Status (doughnut) */
            makeChart('custStatusChart', doughnutConfig(
                ['Delivered', 'Processing', 'Pending', 'Cancelled'],
                [10, 1, 2, 1],
                [GREEN, AMBER, GRAY, RED]
            ));

            /* Customer: Purchase Categories (doughnut) */
            makeChart('custCategoriesChart', doughnutConfig(
                ['Medicines', 'Vitamins & Supplements', 'Skin Care', 'Personal Care', 'Baby Care', 'Medical Devices'],
                [5, 4, 2, 1, 1, 1],
                [GREEN, GREEN_LIGHT, GREEN_DARK, GREEN_MID, AMBER, BLUE]
            ));
        }
    });
})();