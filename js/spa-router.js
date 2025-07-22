window.navigateTo = function(pageUrl) {

    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            document.head.innerHTML = doc.head.innerHTML;

            const stylePromises = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'))
                .map(link => new Promise(resolve => {
                    link.onload = resolve;
                    link.onerror = resolve;
                }));

            Promise.all(stylePromises).then(() => {
                const currentScripts = Array.from(document.body.querySelectorAll('script[data-spa-router-script="true"]'));
                currentScripts.forEach(script => {
                    script.remove();
                });

                document.body.innerHTML = doc.body.innerHTML;

                const scriptPromises = [];
                doc.querySelectorAll('script').forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                        newScript.async = false;
                        newScript.setAttribute('data-spa-router-script', 'true');
                        scriptPromises.push(new Promise(resolve => {
                            newScript.onload = resolve;
                            newScript.onerror = resolve; 
                        }));
                    } else if (script.textContent) {
                        newScript.textContent = script.textContent;
                        newScript.setAttribute('data-spa-router-script', 'true');

                        scriptPromises.push(Promise.resolve());
                    }
                    document.body.appendChild(newScript);
                });

                Promise.all(scriptPromises).then(() => {
                    window.history.pushState(null, '', pageUrl);

                    const event = new CustomEvent('spaContentLoaded', { detail: { pageUrl: pageUrl } });
                    document.dispatchEvent(event);
                });
            });
        })
        .catch((error) => {
            console.error('SPA Router: Error al navegar SPA:', error);
            window.location.href = pageUrl;
        });
}

window.addEventListener('popstate', () => {
    window.location.reload();
});