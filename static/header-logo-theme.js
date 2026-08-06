(() => {
	const script = document.currentScript;
	if (!(script instanceof HTMLScriptElement)) return;

	const { darkLogo, lightLogo } = script.dataset;
	if (!darkLogo || !lightLogo) return;

	const root = document.documentElement;
	const updateHeaderLogo = () => {
		const activeLogo = root.classList.contains('dark') ? darkLogo : lightLogo;
		root.style.setProperty('--header-logo-image', `url("${activeLogo}")`);
	};

	updateHeaderLogo();
	if (root.hasAttribute('data-header-logo-theme-observer')) return;

	root.setAttribute('data-header-logo-theme-observer', '');
	new MutationObserver(updateHeaderLogo).observe(root, {
		attributes: true,
		attributeFilter: ['class']
	});
})();
