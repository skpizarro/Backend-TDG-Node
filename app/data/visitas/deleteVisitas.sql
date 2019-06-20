DELETE  [dbo].[visitas]
WHERE   [idVisitaQR] = @idQR
    AND   [idUsuario] = @idUsuario;