const CPF = require('cpf-check');
const ProgressBar = require('progress');

const inputtedCpf = process.argv[2];

if (!inputtedCpf) {
  console.log('CPF obrigatório');
  process.exit(1);
}

const cleanedCpf = inputtedCpf.replace(/[^\d|*]/g, '');

if (cleanedCpf.length !== 11) {
  console.log('CPF deve ter 11 caracteres');
  process.exit(1);
}

const amountOfPendentNumbers = cleanedCpf.length - cleanedCpf.replaceAll('*', '').length;
const amountOfPossibilities = 10 ** amountOfPendentNumbers;

if (!amountOfPendentNumbers) {
  console.log('nenhum caractere pendente encontrado');
  process.exit(1);
}

const progress = new ProgressBar(`processando: :percent  :etas`, {
  total: amountOfPossibilities,
  renderThrottle: 100,
  clear: true,
});

const validCpf = [];

let currentPossibility = 0;
while (currentPossibility < amountOfPossibilities) {
  const numbersToInset = [...currentPossibility.toString()];

  const valueToFill = Array(amountOfPendentNumbers - numbersToInset.length).fill('0');
  numbersToInset.unshift(...valueToFill);

  const finalCpf = cleanedCpf.replaceAll('*', () => numbersToInset.shift());

  if (CPF.validate(finalCpf)) validCpf.push(finalCpf);

  currentPossibility++;
  progress.tick(currentPossibility - progress.curr);
}

console.log(validCpf.map(CPF.format).join('\n'));
console.log(`\n${validCpf.length} CPFs validos encontrados`);
