import xmlParser from 'xml2js'

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



}
