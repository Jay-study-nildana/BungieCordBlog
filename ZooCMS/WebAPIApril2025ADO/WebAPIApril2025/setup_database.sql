-- Create Database
--already done by migrations
--but if you want to do manually
CREATE DATABASE ZooCMS;
GO

USE ZooCMS;
GO

-- Create Publishers Table
--already done by migrations
--but if you want to do manually
CREATE TABLE Publishers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL
);
GO

-- Create Comics Table
--already done by migrations
--but if you want to do manually
CREATE TABLE Comics (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    PublisherId INT NOT NULL,
    FOREIGN KEY (PublisherId) REFERENCES Publishers(Id)
);
GO

-- Create Characters Table
--already done by migrations
--but if you want to do manually
CREATE TABLE Characters (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    ComicId INT NOT NULL,
    FOREIGN KEY (ComicId) REFERENCES Comics(Id)
);
GO

-- Create Stored Procedure: usp_CreateCharacter
CREATE PROCEDURE usp_CreateCharacter
    @Name NVARCHAR(100),
    @ComicId INT,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert a new character into the Characters table
    INSERT INTO Characters (Name, ComicId)
    VALUES (@Name, @ComicId);

    -- Get the ID of the inserted character
    SET @Id = SCOPE_IDENTITY();
END;
GO

-- Create Stored Procedure: usp_GetCharacters
CREATE PROCEDURE usp_GetCharacters
AS
BEGIN
    SET NOCOUNT ON;

    SELECT c.Id, c.Name, c.ComicId, co.Title AS ComicTitle
    FROM Characters c
    INNER JOIN Comics co ON c.ComicId = co.Id;
END;
GO

-- Create Stored Procedure: usp_GetComics
CREATE PROCEDURE usp_GetComics
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Title, PublisherId
    FROM Comics;
END;
GO

-- Create Stored Procedure: usp_CreateComic
CREATE PROCEDURE usp_CreateComic
    @Title NVARCHAR(100),
    @PublisherId INT,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Insert a new comic into the Comics table
    INSERT INTO Comics (Title, PublisherId)
    VALUES (@Title, @PublisherId);

    -- Get the ID of the inserted comic
    SET @Id = SCOPE_IDENTITY();
END;
GO

-- Insert Sample Data into Publishers
INSERT INTO Publishers (Name)
VALUES ('Marvel Comics'),
       ('DC Comics'),
       ('Image Comics');
GO

-- Insert Sample Data into Comics
INSERT INTO Comics (Title, PublisherId)
VALUES ('Amazing Spider-Man', 1),
       ('Batman', 2),
       ('Spawn', 3);
GO

-- Insert Sample Data into Characters
INSERT INTO Characters (Name, ComicId)
VALUES ('Peter Parker', 1),
       ('Bruce Wayne', 2),
       ('Al Simmons', 3);
GO

-- Verify Data in Tables
SELECT * FROM Publishers;
SELECT * FROM Comics;
SELECT * FROM Characters;
GO