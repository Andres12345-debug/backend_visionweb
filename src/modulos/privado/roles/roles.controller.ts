import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Rol } from 'src/modelos/rol/rol';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService : RolesService){}
    @Get('/todos')
    public obtenerProductos(): any{
        return this.rolesService.consultar();
    }
    @Post("/agregar")
    public registrarProducto(@Body() objCate: Rol): any{
        return this.rolesService.registrar(objCate);
    }
    @Get("/one/:cod_rol")
    public consultarUnProducto(@Param() parametro: any): any{
        const codigoCate : number = Number(parametro.cod_rol);
        if(!isNaN(codigoCate)){
            return this.rolesService.consultarUno(codigoCate);
        }else{
            return new HttpException('El codigo del rol no es valido', HttpStatus.NOT_ACCEPTABLE);

        }        
    }
    @Put("/update/:cod_rol")
    public actualizar(@Body() objActualizar: Rol, @Param() parametros: any): any{
        const codigo: number = Number(parametros.cod_rol);
        if(!isNaN(codigo)){
            return this.rolesService.actualizar(objActualizar, codigo)
        }else{
            return new HttpException("Fallo al actualizar el rol", HttpStatus.BAD_REQUEST)
        }
    }
    @Delete("/delete/:cod_rol")
    public borrarProducto(@Body() objBorrar: Rol, @Param() parametros: any): any{
        const codigo: number = Number(parametros.cod_rol);
        if(!isNaN(codigo)){
            return this.rolesService.eliminar(objBorrar, codigo);
        }else{
            return new HttpException("fallo al borrar", HttpStatus.BAD_REQUEST)
        }
    }
}
