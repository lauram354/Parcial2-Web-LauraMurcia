import { Test, TestingModule } from '@nestjs/testing';
import { ReseniaService } from './resenia.service';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReseniaEntity } from './resenia.entity/resenia.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity/actividad.entity';

describe('ReseniaService', () => {
  let service: ReseniaService;
  let repository: Repository<ReseniaEntity>;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ReseniaService],
    }).compile();

    service = module.get<ReseniaService>(ReseniaService);
    repository = module.get<Repository<ReseniaEntity>>(getRepositoryToken(ReseniaEntity));
    estudianteRepository = module.get<Repository<EstudianteEntity>>(getRepositoryToken(EstudianteEntity));
    actividadRepository = module.get<Repository<ActividadEntity>>(getRepositoryToken(ActividadEntity));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería agregar reseña exitosamente', async () => {
    const actividad = await actividadRepository.save({
      titulo: "titulovalidolosuficientementevalido",
      estado: 2, 
      cupo: 10,
      fecha: "18/05/2025",
      estudiantes: [],
      resenias: [],
    });

    const estudiante = await estudianteRepository.save({
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.lorem.words(2),
      semestre: faker.number.int({ min: 1, max: 10 }),
      resenias: [],
      actividades: [actividad]
    });

    const resenia: ReseniaEntity = {
      id: 1,
      comentario: "Excelente actividad",
      calificacion: 5,
      estudiante: estudiante,
      actividad: actividad,
      fecha: "18/05/2025"
    };

    const resultado = await service.agregarResenia(resenia);
    expect(resultado).toBeDefined();
    expect(resultado.calificacion).toBe(5);
    expect(resultado.comentario).toBe("Excelente actividad");
    expect(resultado.fecha).toBe("18/05/2025");

  });


  it('debería fallar en agregar reseña si el estudiante no existe', async () => {
    const actividad = await actividadRepository.save({
      titulo: "titulovalidolosuficientementevalido",
      estado: 2, 
      cupo: 10,
      fecha: "18/05/2025",
      estudiantes: [],
      resenias: [],
    });

    const estudiante: EstudianteEntity = {
      id: 0,
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.lorem.words(2),
      semestre: faker.number.int({ min: 1, max: 10 }),
      resenias: [],
      actividades: [actividad]
    };

    const resenia: ReseniaEntity = {
      id: 1,
      comentario: "Excelente actividad",
      calificacion: 5,
      estudiante: estudiante,
      actividad: actividad,
      fecha: "18/05/2025"
    };

    await expect(service.agregarResenia(resenia)).rejects.toHaveProperty("message", "estudiante no existe")


  });


  it('debería fallar en agregar reseña si la actividad no existe', async () => {

    const estudiante = await estudianteRepository.save({
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.lorem.words(2),
      semestre: faker.number.int({ min: 1, max: 10 }),
      resenias: [],
      actividades: []
    });

    const actividad: ActividadEntity = { id: 9999 } as ActividadEntity;

    const resenia: ReseniaEntity = {
      id: 1,
      comentario: "Excelente actividad",
      calificacion: 5,
      estudiante: estudiante,
      actividad: actividad,
      fecha: "18/05/2025"
    };
    await expect(service.agregarResenia(resenia)).rejects.toHaveProperty("message", "actividad no existe")
  });

  
  it('debería fallar en agregar reseña ya que el estudiante no esta inscrito', async () => {
    const actividad = await actividadRepository.save({
      titulo: "titulovalidolosuficientementevalido",
      estado: 2, 
      cupo: 10,
      fecha: "18/05/2025",
      estudiantes: [],
      resenias: [],
    });

    const estudiante = await estudianteRepository.save({
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.lorem.words(2),
      semestre: faker.number.int({ min: 1, max: 10 }),
      resenias: [],
      actividades: []
    });

    const resenia: ReseniaEntity = {
      id: 1,
      comentario: "Excelente actividad",
      calificacion: 5,
      estudiante: estudiante,
      actividad: actividad,
      fecha: "18/05/2025"
    };

    await expect(service.agregarResenia(resenia)).rejects.toHaveProperty("message", "estudiante no estuvo inscrito")
  });

  
  it('debería fallar en agregar reseña ya que la actividad no esta finalizada', async () => {
    const actividad = await actividadRepository.save({
      titulo: "titulovalidolosuficientementevalido",
      estado: 1, 
      cupo: 10,
      fecha: "18/05/2025",
      estudiantes: [],
      resenias: [],
    });

    const estudiante = await estudianteRepository.save({
      cedula: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.fullName(),
      correo: faker.internet.email(),
      programa: faker.lorem.words(2),
      semestre: faker.number.int({ min: 1, max: 10 }),
      resenias: [],
      actividades: [actividad]
    });

    const resenia: ReseniaEntity = {
      id: 1,
      comentario: "Excelente actividad",
      calificacion: 5,
      estudiante: estudiante,
      actividad: actividad,
      fecha: "18/05/2025"
    };

    await expect(service.agregarResenia(resenia)).rejects.toHaveProperty("message", "actividad no finalizada")
  });

});
