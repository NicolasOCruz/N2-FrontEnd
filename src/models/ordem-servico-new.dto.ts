import { PagamentoDTO } from './pagamento.dto';
import { RefDTO } from './ref.dto';

export interface OrdemServicoNewDTO{
    cliente : RefDTO;
    descricao : string;
    preco : string;
    endereco : RefDTO;
    pagamento : PagamentoDTO
}