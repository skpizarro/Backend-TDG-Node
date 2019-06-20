INSERT INTO [dbo].[visitas]
    (
    [idVisitaQR]
    , [idUsuario]
    , [nombresUsuario]
    , [emailUsuario]
    , [tipoUsuario]
    , [motivoVisita]
    , [fechaVisita]
    )
VALUES
    (
        @idQR
    , @idUsuario
    , @nombresUsuario
    , @emailUsuario
    , @tipoUsuario
    , @motivoVisita
    , @fechaVisita
);

-- SELECT SCOPE_IDENTITY() AS id;