/**
 * @schema functional
 * Contains business logic, operational procedures, and tables for the application.
 */
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'functional')
BEGIN
    EXEC('CREATE SCHEMA functional');
END
GO

/*
DROP TABLE IF EXISTS [functional].[task];
*/

/**
 * @table task Stores user-defined tasks.
 * @multitenancy true
 * @softDelete true
 * @alias tsk
 */
CREATE TABLE [functional].[task] (
  [idTask] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idUserCreator] INTEGER NOT NULL,
  [idCategory] INTEGER NULL,
  [title] NVARCHAR(100) NOT NULL,
  [description] NVARCHAR(500) NOT NULL,
  [dueDate] DATETIME2 NULL,
  [priority] TINYINT NOT NULL,
  [status] TINYINT NOT NULL,
  [recurrence] TINYINT NOT NULL,
  [recurrenceConfigJson] NVARCHAR(MAX) NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL,
  [deleted] BIT NOT NULL
);
GO

/**
 * @primaryKey pkTask
 * @keyType Object
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [pkTask] PRIMARY KEY CLUSTERED ([idTask]);
GO

-- Foreign key constraints will be added when the referenced tables (account, user, category) are created.
-- For now, we will add indexes assuming those tables exist in `subscription` and `functional` schemas.

/**
 * @check chkTask_priority Defines allowed values for task priority.
 * @enum {0} Low
 * @enum {1} Medium
 * @enum {2} High
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_priority] CHECK ([priority] BETWEEN 0 AND 2);
GO

/**
 * @check chkTask_status Defines allowed values for task status.
 * @enum {0} Pending
 * @enum {1} InProgress
 * @enum {2} Completed
 * @enum {3} Canceled
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_status] CHECK ([status] BETWEEN 0 AND 3);
GO

/**
 * @check chkTask_recurrence Defines allowed values for task recurrence.
 * @enum {0} None
 * @enum {1} Daily
 * @enum {2} Weekly
 * @enum {3} Monthly
 * @enum {4} Custom
 */
ALTER TABLE [functional].[task]
ADD CONSTRAINT [chkTask_recurrence] CHECK ([recurrence] BETWEEN 0 AND 4);
GO

ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_priority] DEFAULT (1) FOR [priority];
GO

ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_status] DEFAULT (0) FOR [status];
GO

ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_recurrence] DEFAULT (0) FOR [recurrence];
GO

ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_dateCreated] DEFAULT (GETUTCDATE()) FOR [dateCreated];
GO

ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_dateModified] DEFAULT (GETUTCDATE()) FOR [dateModified];
GO

ALTER TABLE [functional].[task]
ADD CONSTRAINT [dfTask_deleted] DEFAULT (0) FOR [deleted];
GO

/**
 * @index ixTask_Account Ensures efficient data retrieval by account.
 * @type Performance
 * @filter Includes only non-deleted records.
 */
CREATE NONCLUSTERED INDEX [ixTask_Account]
ON [functional].[task]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_UserCreator Ensures efficient filtering by the user who created the task.
 * @type Search
 * @filter Includes only non-deleted records.
 */
CREATE NONCLUSTERED INDEX [ixTask_UserCreator]
ON [functional].[task]([idAccount], [idUserCreator])
WHERE [deleted] = 0;
GO

/**
 * @index ixTask_Category Optimizes queries filtering by category.
 * @type Search
 * @filter Includes only non-deleted records.
 */
CREATE NONCLUSTERED INDEX [ixTask_Category]
ON [functional].[task]([idAccount], [idCategory])
WHERE [deleted] = 0 AND [idCategory] IS NOT NULL;
GO

/**
 * @index ixTask_Status Optimizes queries filtering by status.
 * @type Search
 * @filter Includes only non-deleted records.
 */
CREATE NONCLUSTERED INDEX [ixTask_Status]
ON [functional].[task]([idAccount], [status])
WHERE [deleted] = 0;
GO
