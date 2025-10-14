const fs = require('fs');
const path = require('path');

const componentTemplate = (name) => `import React from 'react';

const ${name} = () => {
  return (
    <div>
      <h2>${name}</h2>
    </div>
  );
};

export default ${name};
`;

const testTemplate = (name, type) => `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${name} from '../${type}s/${name}';

describe('${name}', () => {
  it('renders the component', () => {
    render(<${name} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });
});
`;

const scaffold = (type, name) => {
  if (!type || !name) {
    console.error('Please provide a type (page or component) and a name.');
    process.exit(1);
  }

  const dir = path.join(__dirname, '..', 'src', `${type}s`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentPath = path.join(dir, `${name}.jsx`);
  const testPath = path.join(dir, `${name}.test.jsx`);

  fs.writeFileSync(componentPath, componentTemplate(name));
  fs.writeFileSync(testPath, testTemplate(name, type));

  console.log(`Created ${type} ${name} at ${componentPath}`);
  console.log(`Created test for ${name} at ${testPath}`);
};

const [type, name] = process.argv.slice(2);
scaffold(type, name);
