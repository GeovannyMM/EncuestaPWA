export function generarFolio(idEntrevistador: number): string {
    // TIMESTAMP_BASE36: Date.now().toString(36)
    //[ID_ENTREVISTADOR (usuario)]-[TIMESTAMP_BASE36]-[RANDOM_4]
    const timestamp = Date.now().toString(36);
    // RANDOM_4: 4 caracteres aleatorios para folio
    const random4 = crypto.randomUUID().split('-')[0].slice(0, 4);

    return `${idEntrevistador}-${timestamp}-${random4}`;
}
