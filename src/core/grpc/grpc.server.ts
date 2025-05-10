import { PackageDefinition } from '@grpc/proto-loader';
import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcServerOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:50051',
    package: ['currency', 'crypto'],
    protoPath: [
      join(__dirname, '../../../currency/interfaces/grpc/currency.proto'),
      join(__dirname, '../../../crypto/interfaces/grpc/crypto.proto'),
    ],
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
