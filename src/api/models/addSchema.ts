import "reflect-metadata";
export default function addSchema(target: any, propertyKey: string | symbol) {
  const type = Reflect.getMetadata("design:type", target, propertyKey);
  if (!target.jsonSchema) {
    target.jsonSchema = {
      type: "object",
      properties: {}
    };
  }
  target.jsonSchema.properties[propertyKey] = { type: type.name.toLowerCase() };
  return target;
}
