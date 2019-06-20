-- Dropping visitas table...
DROP TABLE IF EXISTS visitas;

-- Create visitas table...
CREATE TABLE visitas (
    --idQR--
   idVisitaQR int PRIMARY KEY CLUSTERED NOT NULL
   , idUsuario nvarchar(20) NOT NULL
   , nombresUsuario nvarchar(255) NOT NULL
   , emailUsuario nvarchar(50) NOT NULL
   , tipoUsuario nvarchar(20) NOT NULL
   , motivoVisita nvarchar(255) NULL
   , fechaVisita date NOT NULL
);