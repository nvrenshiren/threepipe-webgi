import {Object3D} from 'three'
import {IObject3D, IObject3DEventMap, IObject3DUserData} from '../IObject'
import {iObjectCommons} from './iObjectCommons'
import {IGeometry} from '../IGeometry'
import {IMaterial} from '../IMaterial'

export class Object3D2<TE extends IObject3DEventMap = IObject3DEventMap,
    TG extends IGeometry | undefined = undefined,
    TM extends IMaterial | IMaterial[] | undefined = undefined
> extends Object3D<TE> implements IObject3D<TE, TG, TM> {
    assetType = 'model' as const
    setDirty = iObjectCommons.setDirty
    refreshUi = iObjectCommons.refreshUi

    declare geometry: TG
    declare material: TM

    /**
     * @deprecated use `this` instead
     */
    get modelObject(): this {
        return this
    }

    constructor() {
        super()
        iObjectCommons.upgradeObject3D.call(this)
    }

    declare userData: IObject3DUserData

    // region inherited type fixes
    // re-declaring from IObject3D because: https://github.com/microsoft/TypeScript/issues/16936

    traverse: (callback: (object: IObject3D) => void) => void
    traverseVisible: (callback: (object: IObject3D) => void) => void
    traverseAncestors: (callback: (object: IObject3D) => void) => void
    getObjectById: <T extends IObject3D = IObject3D>(id: number) => T | undefined
    getObjectByName: <T extends IObject3D = IObject3D>(name: string) => T | undefined
    getObjectByProperty: <T extends IObject3D = IObject3D>(name: string, value: string) => T | undefined
    copy: (source: Object3D2|IObject3D, recursive?: boolean, ...args: any[]) => this
    clone: (recursive?: boolean) => this
    remove: (...object: IObject3D[]) => this
    declare parent: IObject3D | null
    declare children: IObject3D[]
    dispose: (removeFromParent?: boolean) => void

    // endregion

    ['_sChildren']?: Object3D[]
}

