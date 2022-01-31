export default class Helpers{

  /**
   *
   * @param object Objeto com os dados necessários para a abertura do chamado
   * @param keyString
   * @returns
   * >```json
   * {
   *   "resourceName": "schedule",
   *   "resourceId": 102030,
   *   "link": "/schedule/102030.xml",
   * }
   * ```
   */

  public getObjectsValueByStringKey(object: object, keyString: string): any {
    return [object].concat(
      keyString.split('.')).reduce(function(a, b: any) {
        return a[b]
      }
    )

  }
}
