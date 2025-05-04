import { PackageDefinition } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import { Transport, GrpcOptions } from '@nestjs/microservices';
import { join } from 'path';

export const currencyGrpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:50051',
    package: 'currency',
    protoPath: join(__dirname, '../../../../interfaces/grpc/currency.proto'),
    loader: {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    },
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg as PackageDefinition).addToServer(
        server as Pick<any, 'addService'>,
      );
    },
  },
};
