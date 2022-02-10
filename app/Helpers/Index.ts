import xmlParser from 'xml2js'
import Moment from 'moment'

export default class Helpers{

  /**
   * @param object Objeto original
   * @param keyString Strings separadas por ponto
  **/
  public getObjectsValueByStringKey(object: object, keyString: string): any {
    return [object].concat(
      keyString.split('.')).reduce(function(a, b: any) {
        return a[b]
      }
    )

  }

  /**
   * @param stringValue string que deseja converter em objeto
  **/
  public async parseStringXml(stringValue: string){

    const options = {
      tagNameProcessors: [xmlParser.processors.stripPrefix],
      explicitArray: false,
    };

    async function parse(res) {
      const promise = await new Promise((resolve, reject) => {
        const parser = new xmlParser.Parser(options);
        parser.parseString(res, async (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });

      });
      return promise;
    }

    return await parse(stringValue);
  }

  /**
   * @param object object for interface
   * @param type type of interface ( attendance or tables )
   * @return object
  **/
  public async formatObject(object: any, type: string){
    if (type == `attendance`){
      const {
        paciente: {
          cd_paciente,
          nm_paciente,
          dt_nascimento,
          sn_vip,
          telefone
        },
        atendimento: {
          tp_atendimento,
          dt_atendimento,
          hr_atendimento,
          dt_alta,
          hr_alta,
          origem: {
            cd_ori_ate,
            ds_ori_ate,
            tp_origem
          },
          setor: {
            cd_setor,
            ds_setor
          },
          unidade_internacao: {
            cd_unid_int,
            ds_unid_int
          },
          convenio: {
            cd_convenio,
            nm_convenio
          },
          leito: {
            cd_leito,
            ds_leito,
            ds_resumo_leito,
            tp_ocupacao
          }
        }
      } = object

      let startDateFormated: string =
      Moment(dt_atendimento).format(`YYYY-MM-DD`);

      let startHourFormated: string =
        Moment(hr_atendimento).format(`HH:mm:ss`);

      let endDateFormated = dt_alta != '' ?
        Moment(dt_alta).format(`YYYY-MM-DD`) : null;

      let endHourFormated = dt_alta != '' ?
        Moment(hr_alta).format(`HH:mm:ss`) : null;

      let birthDateFormated =
        Moment(dt_nascimento).format(`YYYY-MM-DD HH:mm:ss`);

      let snVip = sn_vip == `S` ? true : false;

      let formatedRet = {
        dataOrigin: `External API`,
        paciente: {
          cd_paciente,
          nm_paciente,
          dt_nascimento: birthDateFormated,
          sn_vip: snVip,
          telefone
        },
        atendimento: {
          tp_atendimento,
          dt_atendimento: startDateFormated,
          hr_atendimento: startHourFormated,
          dt_alta: endDateFormated,
          hr_alta: endHourFormated,
          origem: {
            cd_ori_ate,
            ds_ori_ate,
            tp_origem
          },
          setor: {
            cd_setor,
            ds_setor
          },
          unidade_internacao: {
            cd_unid_int,
            ds_unid_int
          },
          convenio: {
            cd_convenio,
            nm_convenio
          },
          leito: {
            cd_leito,
            ds_leito,
            ds_resumo_leito,
            tp_ocupacao
          }
        }
      };

      return formatedRet;

    }else if (type == `tables`){
      object.dataOrigin = `External API`;
      return object

      // const {
      //   setores: {
      //     setor:{
      //       cd_setor: cd_setor,
      //       ds_setor: ds_setor,
      //       sn_ativo: sn_ativo_setor,
      //       unidades_internacao: [
      //         {
      //           unidade_internacao: [
      //             {
      //               cd_unid_int: cd_unid_int,
      //               ds_unid_int: ds_unid_int,
      //               sn_ativo: sn_ativo_unidade_internacao,
      //               leitos: [
      //                 {
      //                   leito: [
      //                     {
      //                       cd_leito: cd_leito,
      //                       ds_leito: ds_leito,
      //                       cd_tip_acomodacao: cd_tip_acomodacao,
      //                       ds_tip_acomodacao: ds_tip_acomodacao,
      //                       ds_resumo_leito: ds_resumo_leito,
      //                       tp_ocupacao: tp_ocupacao,
      //                       sn_ativo: sn_ativo_leito,
      //                     }
      //                   ]
      //                 }
      //               ]
      //             }
      //           ]
      //         }
      //       ]
      //     }
      //   }
      // } = object

      // return {
      //   setores: {
      //     setor: {
      //       cd_setor,
      //       ds_setor,
      //       sn_ativo_setor,
      //       unidades_internacao: {
      //         unidades_internacao: [
      //           {
      //             cd_unid_int,
      //             ds_unid_int,
      //             sn_ativo_unidade_internacao,
      //             leitos: {
      //               leito: [
      //                 {
      //                   cd_leito,
      //                   ds_leito,
      //                   cd_tip_acomodacao,
      //                   ds_tip_acomodacao,
      //                   ds_resumo_leito,
      //                   tp_ocupacao,
      //                   sn_ativo_leito,
      //                 }
      //               ]
      //             }
      //           }
      //         ]
      //       }
      //     }
      //   }
      // }

    }

  }



}
