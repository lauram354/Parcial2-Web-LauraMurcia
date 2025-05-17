import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActividadEntity } from './actividad.entity/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';

describe('ActividadService', () => {
  let service: ActividadService;
  let repository: Repository<ActividadEntity>;
  let actividadesList: ActividadEntity[];
  let estudianteRepository: Repository<EstudianteEntity>;
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));
    estudianteRepository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear(); 
    estudianteRepository.clear();
    actividadesList = [];
    for(let i = 0; i < 5; i++){
        const actividad: ActividadEntity =  await repository.save({
          id: i+1,
          titulo: "titulolosuficientementelargo",
          fecha: faker.date.toString(),
          cupo: 10,
          estado: 0,
          estudiantes: [],
          resenias: []
      })
      actividadesList.push(actividad);
      }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('crear actividad', async () => {
    const actividad = actividadesList[0];

    const result : ActividadEntity = await service.crearActividad(actividad);
    expect(result).not.toBeNull();

    const storedResult = await repository.findOne({where: {id: result.id}})
    expect(storedResult).not.toBeNull();
    expect(storedResult?.titulo).toEqual(result.titulo)
    expect(storedResult?.fecha).toEqual(result.fecha)
    expect(storedResult?.cupo).toEqual(result.cupo)
    expect(storedResult?.estado).toEqual(result.estado)
  });

  it('crear actividad rechazada por titulo muy corto', async () => {
    const actividad = await repository.save({
      titulo: "titulocorto",
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 0,
      estudiantes: [],
      resenias: []
    });

    await expect(service.crearActividad(actividad)).rejects.toHaveProperty("message", "El titulo debe tener 15 caracteres")
  });

  it('crear actividad rechazada por titulo con caracteres especiales', async () => {
    const actividad = await repository.save({
      titulo: "titulolargoperoinval?",
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 0,
      estudiantes: [],
      resenias: []
    });

    await expect(service.crearActividad(actividad)).rejects.toHaveProperty("message", "El titulo tiene caracteres especiales")
  });

  it('cambiar estado', async () => {
    const actividad = actividadesList[0];

    let estudiantesList: EstudianteEntity[] = [];
    for(let i = 0; i < 6; i++){
        const estudiante: EstudianteEntity =  await estudianteRepository.save({
          id: i+1,
          cedula: faker.number.int({ min: 10000000, max: 99999999 }),
          nombre: faker.person.fullName(),
          correo: faker.internet.email(),
          programa: faker.lorem.words(2),
          semestre: faker.number.int({ min: 1, max: 10 }),
          resenias: [],
          actividades: [actividad]
      })
      estudiantesList.push(estudiante);
    }
    const actividadActualizada: ActividadEntity = await repository.findOne({where: { id: actividad.id },relations: ["estudiantes"]});
    const result = await service.cambiarEstado(actividadActualizada.id, 1)
  
    expect(result).not.toBeNull();
    expect(result?.estado).toEqual(1)
  });

  
  it('cambiar estado de 0 a 1 pero rechazado por restriccion de cupo', async () => {
    const actividad = actividadesList[0];

    let estudiantesList: EstudianteEntity[] = [];
    for(let i = 0; i < 7; i++){
        const estudiante: EstudianteEntity =  await estudianteRepository.save({
          id: i+1,
          cedula: faker.number.int({ min: 10000000, max: 99999999 }),
          nombre: faker.person.fullName(),
          correo: faker.internet.email(),
          programa: faker.lorem.words(2),
          semestre: faker.number.int({ min: 1, max: 10 }),
          resenias: [],
          actividades: [actividad]
      })
      estudiantesList.push(estudiante);
    }
    const actividadActualizada: ActividadEntity = await repository.findOne({where: { id: actividad.id },relations: ["estudiantes"]});

    await expect(service.cambiarEstado(actividadActualizada.id, 1)).rejects.toHaveProperty("message", "El cupo no es mayor al 80%, no se puede cerrar")
  });

  
  it('cambiar estado de 1 a 2 pero rechazado por restriccion de cupo', async () => {
    const actividad = await repository.save({
      titulo: "titulolargoyvalido",
      fecha: faker.date.toString(),
      cupo: 10,
      estado: 1,
      estudiantes: [],
      resenias: []
    });

    let estudiantesList: EstudianteEntity[] = [];
    for(let i = 0; i < 7; i++){
        const estudiante: EstudianteEntity =  await estudianteRepository.save({
          id: i+1,
          cedula: faker.number.int({ min: 10000000, max: 99999999 }),
          nombre: faker.person.fullName(),
          correo: faker.internet.email(),
          programa: faker.lorem.words(2),
          semestre: faker.number.int({ min: 1, max: 10 }),
          resenias: [],
          actividades: [actividad]
      })
      estudiantesList.push(estudiante);
    }
    const actividadActualizada: ActividadEntity = await repository.findOne({where: { id: actividad.id },relations: ["estudiantes"]});
    await expect(service.cambiarEstado(actividadActualizada.id, 2)).rejects.toHaveProperty("message", "El cupo no esta lleno, no se puede finalizar")
  });

  it('buscar actividades a partir de fecha', async () => {
    repository.clear(); 
    estudianteRepository.clear();
    actividadesList = [];
    for(let i = 0; i < 5; i++){
        const actividad: ActividadEntity =  await repository.save({
          id: i+1,
          titulo: "titulolosuficientementelargo",
          fecha: "17/05/2025",
          cupo: 10,
          estado: 0,
          estudiantes: [],
          resenias: []
      })
      actividadesList.push(actividad);
      }

      const actividadesPorFecha: ActividadEntity[] = await service.findAllActividadesByDate("17/05/2025");
      expect(actividadesPorFecha).not.toBeNull();
      expect(actividadesPorFecha).toHaveLength(actividadesList.length);
  });

  
  it('buscar actividades a partir de fecha y que no se encuentre', async () => {
    repository.clear(); 
    estudianteRepository.clear();
    actividadesList = [];
    for(let i = 0; i < 5; i++){
        const actividad: ActividadEntity =  await repository.save({
          id: i+1,
          titulo: "titulolosuficientementelargo",
          fecha: "17/05/2025",
          cupo: 10,
          estado: 0,
          estudiantes: [],
          resenias: []
      })
      actividadesList.push(actividad);
      }

      const actividadesPorFecha: ActividadEntity[] = await service.findAllActividadesByDate("18/05/2025");
      expect(actividadesPorFecha).not.toBeNull();
      expect(actividadesPorFecha).toHaveLength(0);
  });


});
