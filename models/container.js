const connection = require('../config/index.js')


    
/**
 * 
 * @returns Trae la informacion de la base de datos.
 */
   const getData = async ()=>{
      try {
     const data= await   connection.from('producto').select("*")
     console.log(data)
        // Devuelvo el ultimo id utilizado incrementado en 1
        if(data.length)
          return { data: data  }
        return { newId: 1, data: data}
      } catch (error) {
        console.log(`Error al leer un archivo: ${error.message}`)
        
      }
    }

    const save=async(payload)=>{
      try {
        const { data } = await this.getData()
        data.push( {...payload} )
        connection.from('producto').insert(data)
        
      } catch (error) {
        console.log(`Error al guardar un objeto: ${error.message}`)
        
      }
    }
    
    const updateById =async (payload, id)=> {
      try {
        const { data } = await this.getData()
        const indexFound = data.findIndex( element => element.id === Number(id))
        // Caso no existe objeto con el id indicado
        if( indexFound === -1)
          throw new Error('Elemento no encontrado')
        // Reemplazo el elemento indicado
        data.splice(indexFound, 1, {...payload, id})
       await connection.from('producto').where('id', id).update(payload)

      } catch (error) {
        console.log(`Error al eliminar un objeto: ${error.message}`)
      }
    }

    const getById=async(id) =>{
      try {
        const { data } = await this.getData()
        const foundData = data.find( element => element.id === Number(id) )
        if(!foundData)
          throw new Error('Elemento no encontrado')
        return foundData
      } catch (error) {
        console.log(`Error al obtener un objeto por su id: ${error.message}`)
      }
    }

    const getAll=async()=> {
      try {
        const { data } = await this.getData()
        return data
      } catch (error) {
        console.log(`Error al obtener todos los objetos: ${error.message}`)
      }
    }

    const deleteById=async(id) =>{
      try {

        const { data } = await this.getData()
        const indexFound = data.findIndex( element => Number(element.id) === Number(id))
        // Caso no existe objeto con el id indicado
        if( indexFound === -1)
          throw new Error('Elemento no encontrado')
        // Elimino el elemento indicado
        data.splice(indexFound, 1)
        await connection.from('producto').where('id', id).del()

      } catch (error) {
        console.log(`Error al eliminar un objeto: ${error.message}`)
      }
    }

    const deleteAll=async()=>{
      try {
        await connection.from('producto').del()
      } catch (error) {
        console.log(`Error al eliminar todos los objetos: ${error.message}`)
      }
    }


module.exports =  {getData,save,deleteAll,deleteById,getAll,getById,updateById}