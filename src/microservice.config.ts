import { KafkaOptions, Transport } from "@nestjs/microservices";

export const microserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,

  options: {
    client: {
      brokers: ['165.22.125.172:9092'],
    },
    consumer: {
      groupId: 'app-consumers-auth',
      allowAutoTopicCreation: true,
    },
  },
};
