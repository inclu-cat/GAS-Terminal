import Folder = GoogleAppsScript.Drive.Folder;
import File = GoogleAppsScript.Drive.File;

/**
 * Utilities for file.
 */
export class FileUtils{
  /**
   * Retrieves a file based on its file ID.
   * @param id
   */
  public static getFileById(id:string):File{
    try{
      return DriveApp.getFileById(id);
    }
    catch (e){
      return null;
    }
  }
  /**
   * Retrieves a folder based on its file ID.
   * @param id
   */
  public static getFolderById(id:string):Folder{
      try{
        return DriveApp.getFolderById(id);
      }
      catch (e){
        return null;
      }
  }
}
