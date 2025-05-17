import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity/estudiante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let repository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiantesList: EstudianteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    repository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    actividadRepository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    actividadRepository.clear(); 
    estudiantesList = [];
    for(let i = 0; i < 5; i++){
        const estudiante: EstudianteEntity =  await repository.save({
          id: i+1,
          cedula: faker.number.int({ min: 10000000, max: 99999999 }),
          nombre: faker.person.fullName(),
          correo: faker.internet.email(),
          programa: faker.lorem.words(2),
          semestre: faker.number.int({ min: 1, max: 10 }),
          resenias: [],
          actividades: []
      })
      estudiantesList.push(estudiante);
      }
  }
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('crear nuevo estudiante', async () => {
   const estudiante: EstudianteEntity = {
     id: 1,
     cedula: faker.number.int({ min: 10000000, max: 99999999 }),
     nombre: faker.person.fullName(),
     correo: faker.internet.email(),
     programa: faker.lorem.words(2),
     semestre: faker.number.int({ min: 1, max: 10 }),
     resenias: [],
     actividades: []

   }

   const newEstudiante: EstudianteEntity = await service.crearEstudiante(estudiante);
   expect(newEstudiante).not.toBeNull();

   const storedEstudiante = await repository.findOne({where: {id: newEstudiante.id}})
   expect(storedEstudiante).not.toBeNull();
   expect(storedEstudiante?.cedula).toEqual(newEstudiante.cedula)
   expect(storedEstudiante?.nombre).toEqual(newEstudiante.nombre)
   expect(storedEstudiante?.correo).toEqual(newEstudiante.correo)
   expect(storedEstudiante?.programa).toEqual(newEstudiante.programa)
  });

  it('debe lanzar excepción si no tiene correo valido al crear estudiante', async () => {
    const estudiante: EstudianteEntity = {
      id: 1,
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      correo: 'correo', 
      programa: faker.lorem.words(2),
      semestre: faker.number.int({ min: 1, max: 10 }),
      resenias: [],
      actividades: []
    };
    await expect(service.crearEstudiante(estudiante)).rejects.toHaveProperty("message", "El correo no es valido")
  });

  
  it('lanza error si el semestre no es valido al crear estudiante', async () => {
   const estudiante: EstudianteEntity = {
     id: 1,
     cedula: faker.number.int({ min: 10000000, max: 99999999 }),
     nombre: faker.person.fullName(),
     correo: faker.internet.email(),
     programa: faker.lorem.words(2),
     semestre: 14,
     resenias: [],
     actividades: []

   }
   await expect(service.crearEstudiante(estudiante)).rejects.toHaveProperty("message", "El semestre debe ser de 1 a 10")

  });

  it('findEstudianteById devuelve un estudiante a partir de su id', async () => {
    const storedStudent: EstudianteEntity = estudiantesList[0];
    const estudiante: EstudianteEntity = await service.findEstudianteById(storedStudent.id);
    expect(estudiante).not.toBeNull();
    expect(estudiante?.cedula).toEqual(storedStudent.cedula)
    expect(estudiante?.nombre).toEqual(storedStudent.nombre)
    expect(estudiante?.correo).toEqual(storedStudent.correo)
    expect(estudiante?.programa).toEqual(storedStudent.programa)
  });

  it('findEstudianteById manda  excepcion por estudiante invalido', async () => {
    await expect(() => service.findEstudianteById(0)).rejects.toHaveProperty("message", "estudiante no encontrado")
  });

it('inscribir estudiante en actividad', async () => {
    const estudiante = estudiantesList[1];
    const actividad = await actividadRepository.save({
      titulo: faker.lorem.words(3),
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 0,
      estudiantes: [],
      resenias: []
    });

    const result = await service.inscribirseActividad(estudiante.id, actividad.id);
    expect(result.actividades.length).toBeGreaterThan(0);
    expect(result.actividades.map(a => a.id)).toContain(actividad.id);
  });


  it('lanza excepción si la actividad no tiene cupo', async () => {
    const estudiante = estudiantesList[0];
    const actividad = await actividadRepository.save({
      id: 1,
      titulo: faker.lorem.words(3),
      fecha: faker.date.toString(),
      cupo: 0,
      estado: 0,
      estudiantes: [],
      resenias: []
    });

    await expect(service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toHaveProperty("message", "No hay cupo")

  });

  it('lanza excepción si la estado no es valido', async () => {
    const estudiante = estudiantesList[0];
    const actividad = await actividadRepository.save({
      id: 1,
      titulo: faker.lorem.words(3),
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 1,
      estudiantes: [],
      resenias: []
    });

    await expect(service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toHaveProperty("message", "No es valido el estado")

  });

  it('lanza excepción si ya se había inscrito a la actividad', async () => {
    const estudiante = estudiantesList[0];
    const actividad = await actividadRepository.save({
      titulo: faker.lorem.words(3),
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 0,
      estudiantes: [],
      resenias: []
    });
    await service.inscribirseActividad(estudiante.id, actividad.id)

    await expect(service.inscribirseActividad(estudiante.id, actividad.id)).rejects.toHaveProperty("message", "Hay una inscripcion previa")

  });


  it('lanza excepción si el estudiante no existe', async () => {
    const actividad = await actividadRepository.save({
      id: 1,
      titulo: faker.lorem.words(3),
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 0,
      estudiantes: [],
      resenias: []
    });

    await expect(service.inscribirseActividad(999, actividad.id)).rejects.toHaveProperty("message", "The student with the given id was not found")

  });

  it('lanza excepción si la actividad no existe', async () => {
    const estudiante = estudiantesList[0];

    await expect(service.inscribirseActividad(estudiante.id, 1)).rejects.toHaveProperty("message", "The actividad with the given id was not found")

  });

});
