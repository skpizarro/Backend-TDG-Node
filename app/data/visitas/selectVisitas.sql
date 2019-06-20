SELECT  [idVisitaQR]
       , [idUsuario]
       , [nombresUsuario]
       , [emailUsuario]
       , [tipoUsuario]
       , [motivoVisita]
       , [fechaVisita]
FROM    [dbo].[visitas]
WHERE   [idVisitaQR] = @idQR
-- ORDER BY
--        [startDate], [startTime];