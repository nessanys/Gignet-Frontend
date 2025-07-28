window.navigateTo = function(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            document.head.innerHTML = doc.head.innerHTML;

            const links = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'));
            const promises = links.map(link => new Promise(resolve => {
                link.onload = resolve;
                link.onerror = resolve;
            }));

            Promise.all(promises).then(() => {

                const currentScripts = Array.from(document.body.querySelectorAll('script'));
                currentScripts.forEach(script => {

                    if (!script.src.includes('spa-router.js') && !script.getAttribute('data-spa-router-persistent')) {
                        script.remove();
                    }
                });

                document.body.innerHTML = doc.body.innerHTML;

                doc.querySelectorAll('script').forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                        newScript.async = false;

                        newScript.setAttribute('data-spa-router-script', 'true'); 
                    } else if (script.textContent) {
                        newScript.textContent = script.textContent;
                        newScript.setAttribute('data-spa-router-script', 'true');
                    }
                    document.body.appendChild(newScript);
                });

                window.history.pushState(null, '', pageUrl);
            });
        })
        .catch(() => {
            window.location.href = pageUrl;
        });
}