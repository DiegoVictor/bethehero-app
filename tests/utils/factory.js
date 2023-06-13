import factory from 'factory-girl';
import { faker } from '@faker-js/faker';

factory.define(
  'Incident',
  {},
  {
    id: faker.number.int,
    title: faker.lorem.words,
    description: faker.lorem.paragraph,
    ngo: {
      name: faker.person.fullName,
      email: faker.internet.email,
      whatsapp: () => faker.phone.number('###########'),
      city: faker.location.city,
      uf: faker.location.state,
    },
    value: faker.finance.amount,
  }
);

export default factory;
