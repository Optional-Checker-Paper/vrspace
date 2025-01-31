package org.vrspace.server.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.vrspace.server.core.VRObjectRepository;
import org.vrspace.server.dto.WorldStatus;
import org.vrspace.server.obj.World;

import lombok.extern.slf4j.Slf4j;

/**
 * World controller handles worlds-related operations. Currently only list and
 * count users, publicly available. Eventually it should allow world creation
 * and management for authorised users.
 * 
 * @author joe
 *
 */
@RestController
@Slf4j
@RequestMapping(WorldController.PATH)
public class WorldController extends ApiBase {
  public static final String PATH = API_ROOT + "/worlds";

  @Autowired
  private VRObjectRepository db;

  @GetMapping("/list")
  public List<World> list() {
    List<World> worlds = db.listWorlds();
    log.debug("Worlds: " + worlds);
    return worlds;
  }

  // CHECKME this returns all Clients rather than just users, more methods are
  // required, or more info in WorldStatus DTO
  @GetMapping("/users")
  public List<WorldStatus> users() {
    List<WorldStatus> stats = db.countUsers();
    log.debug("Stats: " + stats);
    return stats;
  }
}
