import CallKit
import Foundation

final class CallDirectoryHandler: CXCallDirectoryProvider {
  private let appGroupId = "group.com.alessiobianchini.callshield"
  private let listFileName = "callshield_directory.json"

  override func beginRequest(with context: CXCallDirectoryExtensionContext) {
    context.delegate = self
    do {
      try addIdentificationNumbers(to: context)
      context.completeRequest()
    } catch {
      context.cancelRequest(withError: error)
    }
  }

  private func addIdentificationNumbers(to context: CXCallDirectoryExtensionContext) throws {
    guard let containerURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupId) else {
      return
    }
    let fileURL = containerURL.appendingPathComponent(listFileName)
    guard let data = try? Data(contentsOf: fileURL) else { return }
    guard let entries = try? JSONDecoder().decode([DirectoryEntry].self, from: data) else { return }

    for entry in entries {
      // E164 digits only; ensure conversion to Int64 succeeds
      if let number = Int64(entry.number.filter { $0.isNumber }) {
        if entry.block {
          context.addBlockingEntry(withNextSequentialPhoneNumber: number)
        } else {
          context.addIdentificationEntry(withNextSequentialPhoneNumber: number, label: entry.label)
        }
      }
    }
  }
}

extension CallDirectoryHandler: CXCallDirectoryExtensionContextDelegate {
  func requestFailed(for context: CXCallDirectoryExtensionContext, withError error: Error) {
    NSLog("[CallShieldDirectory] request failed: \(error)")
  }
}

struct DirectoryEntry: Codable {
  let number: String
  let label: String
  let block: Bool
}
