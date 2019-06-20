-- Dropping events table...
DROP TABLE IF EXISTS events;

-- Create events table...
CREATE TABLE events (
   id int IDENTITY(1, 1) PRIMARY KEY CLUSTERED NOT NULL
   , userId nvarchar(50) NOT NULL
   , title nvarchar(200) NOT NULL
   , description nvarchar(1000) NULL
   , startDate date NOT NULL
   , startTime time(0) NULL
   , endDate date NULL
   , endTime time(0) NULL
   , INDEX idx_events_userId ( userId )
);

-- Dropping visitas table...
DROP TABLE IF EXISTS visitas;

-- Create visitas table...
CREATE TABLE visitas (
   idVisitaQR int IDENTITY(1, 1) PRIMARY KEY CLUSTERED NOT NULL
   , idUsuario nvarchar(20) NOT NULL
   , nombresUsuario nvarchar(255) NOT NULL
   , emailUsuario nvarchar(50) NOT NULL
   , tipoUsuario nvarchar(20) NOT NULL
   , motivoVisita nvarchar(255) NULL
   , fechaVisita date NOT NULL
   , INDEX idx_events_userId ( userId )
);