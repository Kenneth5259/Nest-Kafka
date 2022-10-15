This is a NestJS Module for enabling a consumer service and a producer service.

The module is dynamic and accepts a KafkaConfig object, defined in the src/config folder.

The default values for the config are:

- localhost for the broker,
- 9092 as the port
- defaultGroupId as the group id for the consumer
