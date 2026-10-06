// Efecto del titular: las letras aparecen "cifradas" (al azar) y se van
// descifrando una a una, de izquierda a derecha, como en la máquina Enigma.
// Si la persona prefiere menos movimiento, no se anima nada.

(function () {
    var destino = document.querySelector('.titular-texto');
    var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!destino || menosMovimiento) {
        return;
    }

    var original = Array.from(destino.textContent);
    var simbolos = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789#*';
    var retrasoPorLetra = 40;   // ms entre una letra y la siguiente
    var tiempoCifrada = 500;    // ms que cada letra pasa cifrada antes de resolverse
    var cambioCada = 70;        // ms entre cambios de símbolo (para que no parpadee demasiado)

    function simboloAlAzar() {
        return simbolos.charAt(Math.floor(Math.random() * simbolos.length));
    }

    destino.textContent = '';

    var celdas = original.map(function (caracter) {
        var celda = document.createElement('span');
        celda.textContent = caracter === ' ' ? ' ' : simboloAlAzar();
        destino.appendChild(celda);
        return celda;
    });

    destino.classList.add('activo');

    var inicio = performance.now();
    var ultimoCambio = inicio;

    function pintar(ahora) {
        var transcurrido = ahora - inicio;
        var cambiar = (ahora - ultimoCambio) >= cambioCada;
        var pendientes = 0;

        if (cambiar) {
            ultimoCambio = ahora;
        }

        celdas.forEach(function (celda, i) {
            var caracter = original[i];

            if (caracter === ' ') {
                return;
            }

            var resuelveEn = i * retrasoPorLetra + tiempoCifrada;

            if (transcurrido >= resuelveEn) {
                if (!celda.classList.contains('listo')) {
                    celda.textContent = caracter;
                    celda.classList.add('listo');
                }
            } else {
                pendientes++;
                if (cambiar) {
                    celda.textContent = simboloAlAzar();
                }
            }
        });

        if (pendientes > 0) {
            requestAnimationFrame(pintar);
        }
    }

    requestAnimationFrame(pintar);
})();