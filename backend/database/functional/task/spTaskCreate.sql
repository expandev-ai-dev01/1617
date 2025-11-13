/**
 * @summary
 * Creates a new task for a given user and account.
 * 
 * @procedure spTaskCreate
 * @schema functional
 * @type stored-procedure
 * 
 * @endpoints
 * - POST /api/v1/internal/task
 * 
 * @parameters
 * @param {INT} idAccount 
 *   - Required: Yes
 *   - Description: The account identifier.
 * @param {INT} idUser 
 *   - Required: Yes
 *   - Description: The identifier of the user creating the task.
 * @param {NVARCHAR(100)} title
 *   - Required: Yes
 *   - Description: The title of the task.
 * @param {NVARCHAR(500)} description
 *   - Required: Yes
 *   - Description: The detailed description of the task.
 * @param {DATETIME2} dueDate
 *   - Required: No
 *   - Description: The due date and time for the task.
 * @param {TINYINT} priority
 *   - Required: Yes
 *   - Description: The priority of the task (0=Low, 1=Medium, 2=High).
 * @param {INT} idCategory
 *   - Required: No
 *   - Description: The identifier of the category this task belongs to.
 * @param {TINYINT} recurrence
 *   - Required: Yes
 *   - Description: The recurrence pattern for the task.
 * @param {NVARCHAR(MAX)} recurrenceConfigJson
 *   - Required: No
 *   - Description: JSON configuration for recurrence.
 * 
 * @returns {Table} The newly created task record.
 * 
 * @testScenarios
 * - Create a task with only required fields.
 * - Create a task with all optional fields populated.
 * - Attempt to create a task with an invalid priority value (should fail due to CHECK constraint).
 */
CREATE OR ALTER PROCEDURE [functional].[spTaskCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @title NVARCHAR(100),
  @description NVARCHAR(500),
  @dueDate DATETIME2 = NULL,
  @priority TINYINT,
  @idCategory INTEGER = NULL,
  @recurrence TINYINT,
  @recurrenceConfigJson NVARCHAR(MAX) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Ensure required parameters are not null.
   * @throw {TitleRequired}
   * @throw {DescriptionRequired}
   */
  IF (@title IS NULL OR LTRIM(RTRIM(@title)) = '')
  BEGIN
    ;THROW 51000, 'TitleRequired', 1;
    RETURN;
  END;

  IF (@description IS NULL OR LTRIM(RTRIM(@description)) = '')
  BEGIN
    ;THROW 51000, 'DescriptionRequired', 1;
    RETURN;
  END;

  DECLARE @newId TABLE ([id] INTEGER);

  INSERT INTO [functional].[task] (
    [idAccount],
    [idUserCreator],
    [title],
    [description],
    [dueDate],
    [priority],
    [idCategory],
    [recurrence],
    [recurrenceConfigJson]
  )
  OUTPUT INSERTED.[idTask] INTO @newId
  VALUES (
    @idAccount,
    @idUser,
    @title,
    @description,
    @dueDate,
    @priority,
    @idCategory,
    @recurrence,
    @recurrenceConfigJson
  );

  DECLARE @idTask INTEGER = (SELECT [id] FROM @newId);

  /**
   * @output {NewTask, 1, n}
   * @column {INTEGER} idTask
   * - Description: The ID of the newly created task.
   */
  SELECT
    [tsk].[idTask],
    [tsk].[idAccount],
    [tsk].[idUserCreator],
    [tsk].[idCategory],
    [tsk].[title],
    [tsk].[description],
    [tsk].[dueDate],
    [tsk].[priority],
    [tsk].[status],
    [tsk].[recurrence],
    [tsk].[recurrenceConfigJson],
    [tsk].[dateCreated],
    [tsk].[dateModified],
    [tsk].[deleted]
  FROM [functional].[task] [tsk]
  WHERE [tsk].[idTask] = @idTask;

END;
GO
