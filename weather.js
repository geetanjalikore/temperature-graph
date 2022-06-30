const http = require('http');
const fs = require('fs');

class Style {
  constructor() {
    this.attributes = [];
  }
  addAttribute(attribute, value) {
    this.attributes.push([attribute, value]);
  }
  toHtml() {
    return this.attributes.map(([key, val]) => {
      return `${key}:${val}`;
    }).join(';');
  }
}

const generateHtml = (tag, content, attr) =>
  `<${tag} ${attr}> ${content}</${tag}> `;


const bar = ([degree, weather]) => {
  const style = new Style();
  style.addAttribute('width', 30);
  style.addAttribute('height', degree * 30);
  style.addAttribute('margin', 10);
  style.addAttribute('font-family', 'san-serif');
  style.addAttribute('padding', '5px');
  style.addAttribute('font-weight', 'bold');

  const color = weather === 'sunny' ? '#febe48' : 'antiquewhite';
  style.addAttribute('background-color', color);

  return generateHtml('div', degree, `style="${style.toHtml()}"`);
};

const graph = (report) => {
  const bars = report.map(bar).join('');
  const style = new Style();
  style.addAttribute('display', 'flex');
  style.addAttribute('align-items', 'flex-end');
  return generateHtml('div', bars, `style="${style.toHtml()}"`);
};

const report = ({ hourly }) => {
  const { temperature_2m } = hourly;
  return temperature_2m.map(temperature => {
    return temperature > 20 ? [temperature, 'sunny'] : [temperature, 'Normal'];
  });
};

const main = (url) => {
  let data = '';
  http.get(url, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      const result = graph(report(JSON.parse(data)));
      fs.writeFileSync('report.html', result, 'utf8');
    });
  });

};

const url = 'http://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m';

main(url);

