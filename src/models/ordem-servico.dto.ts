export interface OrdemServicoDTO {
    id : string;
    nome : string;
    descricao : string;
    preco : number;
    status : string;
    dataAbertura : Date;
    dataFinalizacao?: Date;
    imageUrl?: string;
}