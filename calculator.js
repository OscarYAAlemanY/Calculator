const pantalla = document.getElementById("pantalla");
let expresion = "";

function agregar(valor) {
  if (pantalla.textContent === "0" && valor !== ".") {
    expresion = valor;
  } else {
    expresion += valor;
  }
  pantalla.textContent = expresion;
}

function limpiar() {
  expresion = "";
  pantalla.textContent = "0";
}

function calcular() {
  try {
    const resultado = evaluarExpresion(expresion);
    pantalla.textContent = resultado;
    expresion = resultado.toString();
  } catch (e) {
    pantalla.textContent = "Error";
    expresion = "";
  }
}

// Evaluación segura 
function evaluarExpresion(exp) {
  const tokens = exp.match(/(\d+(\.\d+)?)|[\+\-\*\/]/g);
  if (!tokens) throw new Error("Expresión inválida");

  const outputQueue = [];
  const operadores = [];
  const precedencia = { "+": 1, "-": 1, "*": 2, "/": 2 };

  tokens.forEach(token => {
    if (!isNaN(token)) {
      outputQueue.push(parseFloat(token));
    } else if (["+", "-", "*", "/"].includes(token)) {
      while (
        operadores.length &&
        precedencia[operadores[operadores.length - 1]] >= precedencia[token]
      ) {
        outputQueue.push(operadores.pop());
      }
      operadores.push(token);
    }
  });

  while (operadores.length) {
    outputQueue.push(operadores.pop());
  }

  const pila = [];
  outputQueue.forEach(token => {
    if (typeof token === "number") {
      pila.push(token);
    } else {
      const b = pila.pop();
      const a = pila.pop();
      switch (token) {
        case "+": pila.push(a + b); break;
        case "-": pila.push(a - b); break;
        case "*": pila.push(a * b); break;
        case "/": pila.push(a / b); break;
      }
    }
  });

  if (pila.length !== 1 || isNaN(pila[0])) throw new Error("Error al calcular");
  return pila[0];
}