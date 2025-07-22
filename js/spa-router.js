window.navigateTo = function(pageUrl) {
    fetch(pageUrl)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 1. Reemplaza el <head> completamente
            // Mantener la lógica de reemplazar head para estilos, como lo tenías o lo ajustamos.
            // Para evitar conflictos con head (que también podría tener scripts),
            // podemos ser más selectivos, o simplemente confiar en tu enfoque actual.
            document.head.innerHTML = doc.head.innerHTML;

            // Espera a que los estilos se carguen
            const links = Array.from(document.head.querySelectorAll('link[rel="stylesheet"]'));
            const promises = links.map(link => new Promise(resolve => {
                link.onload = resolve;
                link.onerror = resolve;
            }));

            Promise.all(promises).then(() => {
                // 2. Eliminar scripts anteriores del <body> inyectados por este router
                // (excepto el propio spa-router.js)
                const currentScripts = Array.from(document.body.querySelectorAll('script'));
                currentScripts.forEach(script => {
                    // Evita eliminar el propio script de spa-router.js
                    if (!script.src.includes('spa-router.js') && !script.getAttribute('data-spa-router-persistent')) {
                        // Considera si este script fue agregado por el router.
                        // Podemos añadir un atributo al agregar para identificarlo.
                        script.remove();
                    }
                });

                document.body.innerHTML = doc.body.innerHTML;

                // 3. Recarga los scripts de la nueva página
                doc.querySelectorAll('script').forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                        newScript.async = false; // Mantiene el orden de ejecución
                        // Añadir un identificador para poder eliminarlo después
                        newScript.setAttribute('data-spa-router-script', 'true'); 
                    } else if (script.textContent) {
                        newScript.textContent = script.textContent;
                        // Añadir un identificador para poder eliminarlo después
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