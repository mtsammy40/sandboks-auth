import { KafkaOptions, Transport } from "@nestjs/microservices";

export const microserviceTestConfig: KafkaOptions = {
  transport: Transport.KAFKA,

  options: {
    client: {
      brokers: ['38.242.152.41:29092'],
    },
    consumer: {
      groupId: 'app-consumers-auth',
      allowAutoTopicCreation: true,
    },
  },
};
