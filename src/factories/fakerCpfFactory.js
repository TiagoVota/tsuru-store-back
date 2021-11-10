import faker from 'faker';


const fakerCpf = () => String(faker.datatype.number({
  min: 10000000000,
  max: 99999999999
}));


export { fakerCpf };
